import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import requireDB from '../middleware/dbMiddleware.js';
import {
  getResult,
  getHistory,
  deleteHistoryItem,
  getReport,
  generateReportPdfMeta,
} from '../controllers/resultController.js';

const router = Router();

router.get('/results/:interviewId', requireDB, protect, getResult);
router.get('/history', requireDB, protect, getHistory);
router.delete('/history/:id', requireDB, protect, deleteHistoryItem);
router.get('/report/:id', requireDB, protect, getReport);
router.post('/report/pdf', requireDB, protect, generateReportPdfMeta);

export default router;
