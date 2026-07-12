import { Router } from 'express';
import protect from '../middleware/authMiddleware.js';
import requireDB from '../middleware/dbMiddleware.js';
import { changePasswordRules, settingsUpdateRules, runValidation } from '../middleware/validators.js';
import { updateSettings, changePassword, logoutAllDevices } from '../controllers/settingsController.js';

const router = Router();

router.use(requireDB, protect);

router.put('/', settingsUpdateRules, runValidation, updateSettings);
router.post('/change-password', changePasswordRules, runValidation, changePassword);
router.post('/logout-all-devices', logoutAllDevices);

export default router;
