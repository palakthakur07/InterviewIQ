import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import requireDB from '../middleware/dbMiddleware.js';
import { getNotifications, markNotificationsRead } from '../controllers/notificationController.js';

const router = Router();

router.use(requireDB, protect);

router.get('/', getNotifications);
router.put('/read', markNotificationsRead);

export default router;
