import Interview from '../models/Interview.js';
import InterviewSession from '../models/InterviewSession.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import Resume from '../models/Resume.js';
import ApiError from '../utils/ApiError.js';

/**
 * Loads a completed interview's full detail: the report itself, a light
 * resume summary, and the ordered question/answer pairs for review.
 * Shared by getResult and getReport so both endpoints stay in sync.
 */
async function loadFullReport(interviewId, userId) {
  const interview = await Interview.findOne({ _id: interviewId, user: userId });
  if (!interview) {
    throw new ApiError(404, 'Interview report not found.');
  }

  const [questions, answers, session, resume] = await Promise.all([
    Question.find({ session: interview.session }),
    Answer.find({ session: interview.session }),
    InterviewSession.findById(interview.session),
    interview.resume ? Resume.findById(interview.resume) : Promise.resolve(null),
  ]);

  // Display questions in the order they were actually asked. If the
  // underlying session was ever removed, fall back to whatever we have.
  const byId = new Map(questions.map((q) => [String(q._id), q]));
  const orderedQuestions = session
    ? session.questionIds.map((id) => byId.get(String(id))).filter(Boolean)
    : questions;
  const finalQuestions = orderedQuestions.length ? orderedQuestions : questions;

  return {
    interview,
    resumeSummary: resume
      ? { skills: resume.skills, technologies: resume.technologies }
      : null,
    questions: finalQuestions.map((q) => q.toPublicJSON()),
    answers: answers.map((a) => a.toPublicJSON()),
  };
}

// GET /api/results/:interviewId
export async function getResult(req, res, next) {
  try {
    const { interview, resumeSummary, questions, answers } = await loadFullReport(
      req.params.interviewId,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      interview: interview.toPublicJSON(),
      resumeSummary,
      questions,
      answers,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/history
export async function getHistory(req, res, next) {
  try {
    const interviews = await Interview.find({ user: req.user._id }).sort({ completedAt: -1 });
    res.status(200).json({
      success: true,
      // Every record here represents a finished interview.
      interviews: interviews.map((i) => ({ ...i.toPublicJSON(), status: 'completed' })),
    });
  } catch (err) {
    next(err);
  }
}

// DELETE /api/history/:id
export async function deleteHistoryItem(req, res, next) {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      throw new ApiError(404, 'Interview report not found.');
    }

    // Cascade delete so no orphaned questions/answers/session are left behind.
    await Promise.all([
      Answer.deleteMany({ session: interview.session }),
      Question.deleteMany({ session: interview.session }),
      InterviewSession.findByIdAndDelete(interview.session),
    ]);
    await Interview.findByIdAndDelete(interview._id);

    res.status(200).json({ success: true, message: 'Interview deleted.' });
  } catch (err) {
    next(err);
  }
}

// GET /api/report/:id
export async function getReport(req, res, next) {
  try {
    const { interview, resumeSummary, questions, answers } = await loadFullReport(
      req.params.id,
      req.user._id,
    );

    res.status(200).json({
      success: true,
      interview: interview.toPublicJSON(),
      resumeSummary,
      questions,
      answers,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/report/pdf
// Body: { interviewId }. The PDF itself is built client-side with jsPDF —
// this endpoint just records that a report was generated, so the "PDF
// metadata" requirement (last-generated timestamp) is tracked server-side.
export async function generateReportPdfMeta(req, res, next) {
  try {
    const { interviewId } = req.body;
    if (!interviewId) {
      throw new ApiError(400, 'interviewId is required.');
    }

    const interview = await Interview.findOne({ _id: interviewId, user: req.user._id });
    if (!interview) {
      throw new ApiError(404, 'Interview report not found.');
    }

    interview.pdfGeneratedAt = new Date();
    await interview.save();

    res.status(200).json({ success: true, interview: interview.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}
