import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import requireDB from '../middleware/dbMiddleware.js';
import {
  startInterview,
  getActiveInterview,
  getInterviewHistory,
  getSession,
  submitAnswer,
  retryEvaluation,
  saveProgress,
  finishInterview,
  getInterviewReport,
} from '../controllers/interviewController.js';

const router = Router();

router.use(requireDB, protect);

router.post('/start', startInterview);
router.get('/active', getActiveInterview);
router.get('/history', getInterviewHistory);

router.get('/session/:sessionId', getSession);
router.post('/session/:sessionId/answer', submitAnswer);
router.post('/session/:sessionId/answer/:answerId/retry', retryEvaluation);
router.patch('/session/:sessionId/save-progress', saveProgress);
router.post('/session/:sessionId/finish', finishInterview);

// Keep this last — it's a single-segment catch-all for report lookups by id.
router.get('/:interviewId', getInterviewReport);

export default router;
