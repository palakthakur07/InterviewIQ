import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatScore, formatDuration, formatDate, getCompanyLabel } from './scoreHelpers';

const SIGNAL_RGB = [110, 86, 207];
const MARGIN = 40;
const PAGE_BOTTOM = 780;

function addBulletSection(doc, { title, items, y, pageWidth }) {
  if (!items || items.length === 0) return y;
  let cursorY = y;

  if (cursorY > PAGE_BOTTOM - 60) {
    doc.addPage();
    cursorY = 50;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 30);
  doc.text(title, MARGIN, cursorY);
  cursorY += 16;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 70);

  items.forEach((item) => {
    const lines = doc.splitTextToSize(`•  ${item}`, pageWidth - MARGIN * 2);
    if (cursorY + lines.length * 13 > PAGE_BOTTOM) {
      doc.addPage();
      cursorY = 50;
    }
    doc.text(lines, MARGIN, cursorY);
    cursorY += lines.length * 13 + 4;
  });

  return cursorY + 8;
}

/**
 * Builds and downloads a PDF report for a finished interview.
 * Runs entirely in the browser — no server round trip for the file itself.
 *
 * @param {{
 *   userName: string,
 *   interview: object,        // Interview.toPublicJSON() shape
 *   resumeSummary: {skills: string[], technologies: string[]} | null,
 *   questions: object[],
 *   answers: object[],
 * }} report
 */
export function generateInterviewReportPdf({ userName, interview, resumeSummary, questions, answers }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 50;

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 30);
  doc.text('InterviewIQ — Interview Report', MARGIN, y);
  y += 26;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(90, 90, 100);
  [
    `Candidate: ${userName || 'N/A'}`,
    `Company mode: ${getCompanyLabel(interview.company)}`,
    `Interview date: ${formatDate(interview.completedAt)}`,
    `Duration: ${formatDuration(interview.durationSeconds)}`,
  ].forEach((line) => {
    doc.text(line, MARGIN, y);
    y += 14;
  });
  y += 8;

  // Resume summary
  if (resumeSummary) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 30);
    doc.text('Resume summary', MARGIN, y);
    y += 16;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 70);
    const skillsLine = doc.splitTextToSize(
      `Skills: ${(resumeSummary.skills || []).join(', ') || 'Not specified'}`,
      pageWidth - MARGIN * 2,
    );
    doc.text(skillsLine, MARGIN, y);
    y += skillsLine.length * 13;

    const techLine = doc.splitTextToSize(
      `Technologies: ${(resumeSummary.technologies || []).join(', ') || 'Not specified'}`,
      pageWidth - MARGIN * 2,
    );
    doc.text(techLine, MARGIN, y);
    y += techLine.length * 13 + 14;
  }

  // Score summary table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 30);
  doc.text('Scores', MARGIN, y);

  const scoreRows = [
    ['Overall', formatScore(interview.overallScore)],
    ['Technical', formatScore(interview.skillScores?.technical)],
    ['Communication', formatScore(interview.skillScores?.communication)],
    ['Problem Solving', formatScore(interview.skillScores?.problemSolving)],
    ['Behavioral', formatScore(interview.skillScores?.behavioral)],
    ['Confidence', formatScore(interview.skillScores?.confidence)],
  ];

  autoTable(doc, {
    startY: y + 8,
    head: [['Category', 'Score / 10']],
    body: scoreRows,
    theme: 'grid',
    margin: { left: MARGIN, right: MARGIN },
    styles: { fontSize: 10, cellPadding: 6 },
    headStyles: { fillColor: SIGNAL_RGB },
  });
  y = (doc.lastAutoTable?.finalY || y + 100) + 24;

  // Hiring recommendation
  if (y > PAGE_BOTTOM - 80) {
    doc.addPage();
    y = 50;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(20, 20, 30);
  doc.text(`Hiring recommendation: ${interview.recommendation?.verdict || 'N/A'}`, MARGIN, y);
  y += 16;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 70);
  const recLines = doc.splitTextToSize(interview.recommendation?.explanation || '', pageWidth - MARGIN * 2);
  doc.text(recLines, MARGIN, y);
  y += recLines.length * 13 + 14;

  // Strengths / Weaknesses / Suggestions
  y = addBulletSection(doc, { title: 'Strengths', items: interview.strengths, y, pageWidth });
  y = addBulletSection(doc, { title: 'Weaknesses', items: interview.weaknesses, y, pageWidth });
  y = addBulletSection(doc, { title: 'Suggestions', items: interview.suggestions, y, pageWidth });

  // Question-by-question summary table
  if (questions?.length) {
    if (y > PAGE_BOTTOM - 100) {
      doc.addPage();
      y = 50;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(20, 20, 30);
    doc.text('Question summary', MARGIN, y);

    const answerByQuestion = new Map((answers || []).map((a) => [String(a.question), a]));
    const rows = questions.map((q, i) => {
      const ans = answerByQuestion.get(String(q.id));
      const scoreText = ans?.skipped ? 'Skipped' : formatScore(ans?.evaluation?.score);
      return [String(i + 1), q.type, q.topic, scoreText];
    });

    autoTable(doc, {
      startY: y + 8,
      head: [['#', 'Type', 'Topic', 'Score']],
      body: rows,
      theme: 'striped',
      margin: { left: MARGIN, right: MARGIN },
      styles: { fontSize: 9, cellPadding: 5 },
      headStyles: { fillColor: SIGNAL_RGB },
    });
  }

  const filename = `InterviewIQ-report-${interview.id || 'interview'}.pdf`;
  doc.save(filename);
}
