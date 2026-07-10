import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import requireDB from '../middleware/dbMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadResume, listResumes, getResume } from '../controllers/resumeController.js';

const router = Router();

// File-shape validation (type/size) runs first so it surfaces regardless of DB status,
// mirroring how auth validation runs before the DB guard.
router.post('/upload', upload.single('resume'), requireDB, protect, uploadResume);
router.get('/', requireDB, protect, listResumes);
router.get('/:id', requireDB, protect, getResume);

export default router;
