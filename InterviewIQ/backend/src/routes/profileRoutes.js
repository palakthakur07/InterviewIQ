import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import requireDB from '../middleware/dbMiddleware.js';
import uploadAvatar from '../middleware/avatarUploadMiddleware.js';
import { profileUpdateRules, runValidation } from '../middleware/validators.js';
import { getProfile, updateProfile, uploadAvatar as uploadAvatarHandler } from '../controllers/profileController.js';

const router = Router();

router.use(requireDB, protect);

router.get('/', getProfile);
router.put('/', profileUpdateRules, runValidation, updateProfile);
// protect() must run first so uploadAvatar's filename() can use req.user._id.
router.post('/avatar', uploadAvatar.single('avatar'), uploadAvatarHandler);

export default router;
