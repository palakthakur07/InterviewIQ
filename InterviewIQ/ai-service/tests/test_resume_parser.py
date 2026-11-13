"""pytest suite for the resume parser (ai-service).

Run from InterviewIQ/ai-service:
    pip install -r requirements-dev.txt --break-system-packages
    pytest -v

Tests marked xfail(strict=True) document real defects (see docs/ISSUES.md).
When you fix a bug, its test starts passing, strict mode reports that as a
failure, and that is your cue to delete the xfail marker and close the issue.
"""
import json

import docx
import fitz  # PyMuPDF
import pytest

from resume_keywords import SKILLS, TECHNOLOGIES
from resume_parser import (
    extract_text_from_docx,
    extract_text_from_pdf,
    find_matches,
    parse_education_section,
    parse_projects_section,
    parse_resume,
    parse_skills_section,
    split_into_sections,
)

SAMPLE_RESUME = """Jane Doe
jane@example.com

SKILLS
Languages: Python, JavaScript
Tools: Git, Docker

PROJECTS
InterviewIQ

Built a REST API with Node.js and MongoDB. Tested with Jest.

EDUCATION
B.Tech in Electronics
XYZ Institute of Technology
2024 - 2028
"""


# ---------- fixtures ----------
@pytest.fixture
def docx_resume(tmp_path):
    path = tmp_path / "resume.docx"
    document = docx.Document()
    for line in SAMPLE_RESUME.splitlines():
        document.add_paragraph(line)
    document.save(path)
    return str(path)


@pytest.fixture
def pdf_resume(tmp_path):
    path = tmp_path / "resume.pdf"
    pdf = fitz.open()
    page = pdf.new_page()
    page.insert_text((50, 72), SAMPLE_RESUME, fontsize=10)
    pdf.save(path)
    pdf.close()
    return str(path)


# ---------- keyword banks ----------
def test_keyword_banks_have_no_case_insensitive_duplicates():
    for bank in (TECHNOLOGIES, SKILLS):
        lowered = [term.lower() for term in bank]
        assert len(lowered) == len(set(lowered))


# ---------- find_matches ----------
def test_find_matches_is_case_insensitive_and_keeps_bank_casing():
    assert "Node.js" in find_matches("built with NODE.JS and python", TECHNOLOGIES)
    assert "Python" in find_matches("built with NODE.JS and python", TECHNOLOGIES)


def test_find_matches_needs_whole_words():
    # "Java" must not match inside "JavaScript".
    found = find_matches("I only know JavaScript", TECHNOLOGIES)
    assert "JavaScript" in found
    assert "Java" not in found


def test_find_matches_returns_each_term_once():
    assert find_matches("Docker docker DOCKER", TECHNOLOGIES) == ["Docker"]


def test_find_matches_empty_text_returns_empty_list():
    assert find_matches("", TECHNOLOGIES) == []


@pytest.mark.xfail(strict=True, reason="BUG #1: 'C' and 'Go' match inside 'C++' and the English word 'go'")
def test_find_matches_has_no_false_positives_for_short_terms():
    found = find_matches("Built tools in C++. Ready to go to market.", TECHNOLOGIES)
    assert "C++" in found
    assert "C" not in found
    assert "Go" not in found


# ---------- split_into_sections ----------
def test_split_into_sections_finds_known_headings():
    sections = split_into_sections(SAMPLE_RESUME)
    assert {"header", "skills", "projects", "education"} <= set(sections)
    assert "Python" in sections["skills"]


def test_split_into_sections_tolerates_punctuation_in_headings():
    sections = split_into_sections("Name\n\nTechnical Skills:\nPython\n")
    assert "Python" in sections["skills"]


def test_split_into_sections_without_headings_is_all_header():
    assert list(split_into_sections("just one line of text")) == ["header"]


def test_split_into_sections_ignores_long_lines_that_contain_a_heading_word():
    text = "Summary of my work: I built many projects over several years of study."
    assert list(split_into_sections(text)) == ["header"]


# ---------- parse_skills_section ----------
def test_parse_skills_section_strips_category_labels():
    assert parse_skills_section("Languages: Python, JavaScript\nTools: Git") == ["Python", "JavaScript", "Git"]


def test_parse_skills_section_drops_single_characters_and_empty_input():
    assert parse_skills_section("Python, x, Git") == ["Python", "Git"]
    assert parse_skills_section("") == []


# ---------- parse_education_section ----------
def test_parse_education_extracts_degree_institution_and_year():
    result = parse_education_section("B.Tech in Electronics\nBPIT College\n2028")
    assert result == [{"degree": "B.Tech in Electronics", "institution": "BPIT College", "year": "2028"}]


def test_parse_education_without_known_keywords_returns_empty_list():
    assert parse_education_section("random text with nothing useful") == []
    assert parse_education_section("") == []


@pytest.mark.xfail(strict=True, reason="BUG #2: year range '2024 - 2028' returns the start year 2024")
def test_parse_education_year_range_returns_graduation_year():
    result = parse_education_section("B.Tech in Electronics\nBPIT College\n2024 - 2028")
    assert result[0]["year"] == "2028"


# ---------- parse_projects_section ----------
def test_parse_projects_blank_line_separated_blocks():
    section = "InterviewIQ\nBuilt a REST API with Node.js and MongoDB.\n\nPortfolio\nStatic site in React."
    projects = parse_projects_section(section, TECHNOLOGIES)
    assert [p["title"] for p in projects] == ["InterviewIQ", "Portfolio"]
    assert {"Node.js", "MongoDB"} <= set(projects[0]["technologies"])
    assert "React" in projects[1]["technologies"]


def test_parse_projects_empty_section_returns_empty_list():
    assert parse_projects_section("", TECHNOLOGIES) == []


@pytest.mark.xfail(strict=True, reason="BUG #3: a project's description line is split off as a separate project")
def test_parse_projects_keeps_title_and_description_together():
    section = "InterviewIQ\nBuilt a REST API with Node.js and MongoDB."
    projects = parse_projects_section(section, TECHNOLOGIES)
    assert len(projects) == 1
    assert projects[0]["title"] == "InterviewIQ"
    assert "Node.js" in projects[0]["technologies"]


# ---------- text extraction ----------
def test_extract_text_from_docx_reads_paragraphs(docx_resume):
    assert "Jane Doe" in extract_text_from_docx(docx_resume)


def test_extract_text_from_pdf_reads_text(pdf_resume):
    assert "Jane Doe" in extract_text_from_pdf(pdf_resume)


# ---------- parse_resume (end to end, JSON on stdout) ----------
@pytest.mark.parametrize("fixture_name,file_type", [("docx_resume", "docx"), ("pdf_resume", "pdf")])
def test_parse_resume_end_to_end(request, capsys, fixture_name, file_type):
    path = request.getfixturevalue(fixture_name)
    parse_resume(path, file_type)
    output = json.loads(capsys.readouterr().out)
    assert output["success"] is True
    data = output["data"]
    assert set(data) == {"skills", "technologies", "softSkills", "projects", "education", "textLength"}
    assert {"Python", "JavaScript", "Docker", "Git"} <= set(data["skills"])
    assert {"Node.js", "MongoDB"} <= set(data["technologies"])
    assert data["education"][0]["institution"].startswith("XYZ Institute")
    assert data["textLength"] > 0


def test_parse_resume_rejects_unsupported_file_type(capsys):
    with pytest.raises(SystemExit) as exit_info:
        parse_resume("whatever.txt", "txt")
    assert exit_info.value.code == 1
    output = json.loads(capsys.readouterr().out)
    assert output["success"] is False
    assert "Unsupported file type" in output["error"]


def test_parse_resume_reports_empty_documents(tmp_path, capsys):
    path = tmp_path / "empty.docx"
    docx.Document().save(path)
    with pytest.raises(SystemExit):
        parse_resume(str(path), "docx")
    output = json.loads(capsys.readouterr().out)
    assert output["success"] is False
    assert "Could not extract any text" in output["error"]


def test_parse_resume_caps_list_sizes(tmp_path, capsys):
    path = tmp_path / "big.docx"
    document = docx.Document()
    document.add_paragraph(" ".join(TECHNOLOGIES))
    document.save(path)
    parse_resume(str(path), "docx")
    data = json.loads(capsys.readouterr().out)["data"]
    assert len(data["technologies"]) <= 30
    assert len(data["skills"]) <= 30