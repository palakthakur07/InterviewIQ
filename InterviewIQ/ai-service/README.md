# AI service — resume parser

Small, dependency-light Python scripts that the Node backend spawns as a
subprocess. No web server here — `resume_parser.py` is invoked directly:

```bash
python3 resume_parser.py <path-to-resume> <pdf|docx>
```

It prints one JSON object to stdout: `{ success, data: { skills, technologies,
softSkills, projects, education, textLength } }` on success, or
`{ success: false, error }` on failure.

## Files
- `resume_parser.py` — text extraction (PyMuPDF for PDF, python-docx for DOCX)
  + heuristic section splitting + keyword-bank matching
- `resume_keywords.py` — curated technology/skill keyword banks and the
  section-heading phrases the parser looks for

## Setup

```bash
pip install -r requirements.txt --break-system-packages
```

## How extraction works (heuristic, not ML)
1. Extract raw text from the file.
2. Split the text into sections (Skills, Projects, Education, ...) by
   matching common resume heading phrases.
3. Skills: parsed from the Skills section if present.
4. Technologies: the full resume text is matched against a curated bank of
   ~120 languages/frameworks/tools, so tools mentioned in project bullets
   are captured even without an explicit "Technologies" heading.
5. Projects: split the Projects section into blocks and pull a title,
   description, and per-project technologies.
6. Education: split the Education section into blocks and pull degree,
   institution, and a 4-digit year if present.

This is intentionally simple and will occasionally mis-split unusually
formatted resumes — good enough for a portfolio project, not a production
resume parser. Gemini-based extraction is a natural upgrade for a later
phase.
