import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import requireDB from '../middleware/dbMiddleware.js';
import requireAdmin from '../middleware/adminMiddleware.js';
import { getAdminDashboard } from '../controllers/adminController.js';

const router = Router();

router.use(requireDB, protect, requireAdmin);

router.get('/dashboard', getAdminDashboard);

export default router;
