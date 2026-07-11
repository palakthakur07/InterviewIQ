import Resume from '../models/Resume.js';
import InterviewSession from '../models/InterviewSession.js';
import Question from '../models/Question.js';
import Answer from '../models/Answer.js';
import Interview from '../models/Interview.js';
import { generateInterviewQuestions } from '../services/interviewGenerationService.js';
import { evaluateAnswer } from '../services/interviewEvaluationService.js';
import { isValidCompany } from '../utils/companyStyles.js';
import { getHiringRecommendation } from '../utils/hiringRecommendation.js';
import ApiError from '../utils/ApiError.js';

function dedupe(strings, maxItems) {
  const seen = new Set();
  const result = [];
  for (const s of strings) {
    const key = s.trim().toLowerCase();
    if (key && !seen.has(key)) {
      seen.add(key);
      result.push(s.trim());
    }
    if (result.length >= maxItems) break;
  }
  return result;
}

async function getOrderedQuestions(session) {
  const questions = await Question.find({ _id: { $in: session.questionIds } });
  const byId = new Map(questions.map((q) => [String(q._id), q]));
  return session.questionIds.map((id) => byId.get(String(id))).filter(Boolean);
}

async function loadOwnedSession(sessionId, userId) {
  const session = await InterviewSession.findOne({ _id: sessionId, user: userId });
  if (!session) {
    throw new ApiError(404, 'Interview session not found.');
  }
  return session;
}

// POST /api/interviews/start
export async function startInterview(req, res, next) {
  try {
    const { resumeId, company = 'general' } = req.body;

    if (!resumeId) {
      throw new ApiError(400, 'Select a resume before starting an interview.');
    }
    if (!isValidCompany(company)) {
      throw new ApiError(400, 'Invalid company mode selected.');
    }

    const resume = await Resume.findOne({ _id: resumeId, user: req.user._id });
    if (!resume) {
      throw new ApiError(404, 'Resume not found. Upload a resume before starting an interview.');
    }

    const existingActive = await InterviewSession.findOne({
      user: req.user._id,
      status: 'in_progress',
    });
    if (existingActive) {
      throw new ApiError(
        409,
        'You already have an interview in progress. Resume or finish it before starting a new one.',
      );
    }

    const generated = await generateInterviewQuestions({
      resume: resume.toPublicJSON(),
      company,
    });

    const session = await InterviewSession.create({
      user: req.user._id,
      resume: resume._id,
      company,
      status: 'in_progress',
      questionIds: [],
      currentQuestionIndex: 0,
    });

    const questionDocs = await Question.insertMany(
      generated.map((q) => ({
        session: session._id,
        type: q.type,
        text: q.text,
        topic: q.topic,
      })),
    );

    session.questionIds = questionDocs.map((q) => q._id);
    await session.save();

    res.status(201).json({
      success: true,
      session: session.toPublicJSON(),
      questions: questionDocs.map((q) => q.toPublicJSON()),
      currentQuestion: questionDocs[0].toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/interviews/active
export async function getActiveInterview(req, res, next) {
  try {
    const session = await InterviewSession.findOne({
      user: req.user._id,
      status: 'in_progress',
    });

    res.status(200).json({
      success: true,
      session: session ? session.toPublicJSON() : null,
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/interviews/history
export async function getInterviewHistory(req, res, next) {
  try {
    const interviews = await Interview.find({ user: req.user._id }).sort({ completedAt: -1 });
    res.status(200).json({
      success: true,
      interviews: interviews.map((i) => i.toPublicJSON()),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/interviews/session/:sessionId
export async function getSession(req, res, next) {
  try {
    const session = await loadOwnedSession(req.params.sessionId, req.user._id);
    const orderedQuestions = await getOrderedQuestions(session);
    const answers = await Answer.find({ session: session._id });

    const isComplete =
      session.status !== 'in_progress' || session.currentQuestionIndex >= session.questionIds.length;
    const currentQuestion = isComplete ? null : orderedQuestions[session.currentQuestionIndex];

    res.status(200).json({
      success: true,
      session: session.toPublicJSON(),
      questions: orderedQuestions.map((q) => q.toPublicJSON()),
      answers: answers.map((a) => a.toPublicJSON()),
      currentQuestion: currentQuestion ? currentQuestion.toPublicJSON() : null,
      isComplete,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/interviews/session/:sessionId/answer
export async function submitAnswer(req, res, next) {
  try {
    const { questionId, answerText, skipped = false } = req.body;
    const session = await loadOwnedSession(req.params.sessionId, req.user._id);

    if (session.status !== 'in_progress') {
      throw new ApiError(400, 'This interview is no longer in progress.');
    }

    const expectedQuestionId = session.questionIds[session.currentQuestionIndex];
    if (!expectedQuestionId || String(expectedQuestionId) !== String(questionId)) {
      throw new ApiError(400, 'This is not the current question for this session.');
    }

    if (!skipped && (!answerText || !answerText.trim())) {
      throw new ApiError(400, 'Enter an answer or skip this question.');
    }

    const question = await Question.findById(questionId);
    if (!question) {
      throw new ApiError(404, 'Question not found.');
    }

    const answer = new Answer({
      session: session._id,
      question: question._id,
      text: skipped ? '' : answerText.trim(),
      skipped: Boolean(skipped),
      evaluationStatus: skipped ? 'skipped' : 'pending',
    });

    let followUp = null;

    if (!skipped) {
      try {
        const result = await evaluateAnswer({
          question: question.toPublicJSON(),
          answerText: answer.text,
          company: session.company,
        });
        answer.evaluation = result.evaluation;
        answer.evaluationStatus = 'evaluated';
        followUp = result.followUp;
      } catch (err) {
        answer.evaluationStatus = 'failed';
        answer.evaluationError = err.message || 'Evaluation failed.';
      }
    }

    await answer.save();

    if (followUp) {
      const followUpQuestion = await Question.create({
        session: session._id,
        type: 'follow-up',
        text: followUp.text,
        topic: followUp.topic,
        followUpTo: question._id,
      });
      session.questionIds.splice(session.currentQuestionIndex + 1, 0, followUpQuestion._id);
    }

    session.currentQuestionIndex += 1;
    session.draftAnswerText = '';
    session.updatedAt = new Date();
    await session.save();

    const isComplete = session.currentQuestionIndex >= session.questionIds.length;
    let nextQuestion = null;
    if (!isComplete) {
      nextQuestion = await Question.findById(session.questionIds[session.currentQuestionIndex]);
    }

    res.status(200).json({
      success: true,
      answer: answer.toPublicJSON(),
      nextQuestion: nextQuestion ? nextQuestion.toPublicJSON() : null,
      progress: {
        currentQuestionIndex: session.currentQuestionIndex,
        totalQuestions: session.questionIds.length,
      },
      isComplete,
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/interviews/session/:sessionId/answer/:answerId/retry
export async function retryEvaluation(req, res, next) {
  try {
    const session = await loadOwnedSession(req.params.sessionId, req.user._id);
    const answer = await Answer.findOne({ _id: req.params.answerId, session: session._id });

    if (!answer) {
      throw new ApiError(404, 'Answer not found.');
    }
    if (answer.skipped) {
      throw new ApiError(400, 'Skipped answers cannot be evaluated.');
    }
    if (answer.evaluationStatus === 'evaluated') {
      res.status(200).json({ success: true, answer: answer.toPublicJSON() });
      return;
    }

    const question = await Question.findById(answer.question);
    if (!question) {
      throw new ApiError(404, 'Question not found.');
    }

    try {
      const result = await evaluateAnswer({
        question: question.toPublicJSON(),
        answerText: answer.text,
        company: session.company,
      });
      answer.evaluation = result.evaluation;
      answer.evaluationStatus = 'evaluated';
      answer.evaluationError = null;
    } catch (err) {
      answer.evaluationStatus = 'failed';
      answer.evaluationError = err.message || 'Evaluation failed.';
    }

    await answer.save();
    res.status(200).json({ success: true, answer: answer.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

// PATCH /api/interviews/session/:sessionId/save-progress
export async function saveProgress(req, res, next) {
  try {
    const { draftAnswerText = '' } = req.body;
    const session = await loadOwnedSession(req.params.sessionId, req.user._id);

    if (session.status !== 'in_progress') {
      throw new ApiError(400, 'This interview is no longer in progress.');
    }

    session.draftAnswerText = typeof draftAnswerText === 'string' ? draftAnswerText : '';
    session.updatedAt = new Date();
    await session.save();

    res.status(200).json({ success: true, session: session.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

// POST /api/interviews/session/:sessionId/finish
export async function finishInterview(req, res, next) {
  try {
    const session = await loadOwnedSession(req.params.sessionId, req.user._id);

    if (session.status === 'completed') {
      const existing = await Interview.findOne({ session: session._id });
      if (existing) {
        res.status(200).json({ success: true, interview: existing.toPublicJSON() });
        return;
      }
    }
    if (session.status === 'abandoned') {
      throw new ApiError(400, 'This interview was abandoned and cannot be finished.');
    }

    const answers = await Answer.find({ session: session._id });
    const evaluated = answers.filter((a) => a.evaluationStatus === 'evaluated' && a.evaluation);
    const answeredCount = answers.filter((a) => !a.skipped).length;
    const skippedCount = answers.filter((a) => a.skipped).length;

    const overallScore = evaluated.length
      ? Math.round((evaluated.reduce((sum, a) => sum + a.evaluation.score, 0) / evaluated.length) * 10) / 10
      : null;

    const strengths = dedupe(evaluated.flatMap((a) => a.evaluation.strengths), 5);
    const weaknesses = dedupe(evaluated.flatMap((a) => a.evaluation.weaknesses), 5);
    // Derived directly from weaknesses rather than a separate Gemini call —
    // keeps the report generation to zero extra API requests.
    const suggestions = weaknesses.map((w) => `Practice: ${w}`);

    // Average each of the 5 category axes across evaluated answers.
    const CATEGORY_KEYS = ['technical', 'communication', 'problemSolving', 'behavioral', 'confidence'];
    const skillScores = {};
    CATEGORY_KEYS.forEach((key) => {
      const values = evaluated
        .map((a) => a.evaluation.categoryScores?.[key])
        .filter((v) => typeof v === 'number' && !Number.isNaN(v));
      skillScores[key] = values.length
        ? Math.round((values.reduce((sum, v) => sum + v, 0) / values.length) * 10) / 10
        : null;
    });

    const recommendation = getHiringRecommendation(overallScore);

    const durationSeconds = Math.max(
      0,
      Math.round((Date.now() - session.startedAt.getTime()) / 1000),
    );

    const interview = await Interview.create({
      user: req.user._id,
      resume: session.resume,
      session: session._id,
      company: session.company,
      totalQuestions: session.questionIds.length,
      answeredCount,
      skippedCount,
      overallScore,
      strengths,
      weaknesses,
      suggestions,
      skillScores,
      recommendation,
      startedAt: session.startedAt,
      completedAt: new Date(),
      durationSeconds,
    });

    session.status = 'completed';
    session.completedAt = new Date();
    session.updatedAt = new Date();
    await session.save();

    res.status(201).json({ success: true, interview: interview.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

// GET /api/interviews/:interviewId
export async function getInterviewReport(req, res, next) {
  try {
    const interview = await Interview.findOne({
      _id: req.params.interviewId,
      user: req.user._id,
    });
    if (!interview) {
      throw new ApiError(404, 'Interview report not found.');
    }
    res.status(200).json({ success: true, interview: interview.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}
