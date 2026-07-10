import { Router } from 'express';
import { signup, login, me } from '../controllers/authController.js';
import { signupRules, loginRules, runValidation } from '../middleware/validators.js';
import protect from '../middleware/authMiddleware.js';
import requireDB from '../middleware/dbMiddleware.js';

const router = Router();

router.post('/signup', signupRules, runValidation, requireDB, signup);
router.post('/login', loginRules, runValidation, requireDB, login);
router.get('/me', requireDB, protect, me);

export default router;
