import { body, validationResult } from 'express-validator';
import ApiError from '../utils/ApiError.js';

export function runValidation(req, res, next) {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const details = result.array().map((e) => e.msg);
    return next(new ApiError(400, 'Validation failed', details));
  }
  next();
}

export const signupRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
];

export const loginRules = [
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Enter a valid email address').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];

// Shared by profileRoutes (PUT /api/profile) and settingsRoutes (PUT /api/settings) —
// every field is optional since callers may send a partial update.
const profileFieldRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 80 })
    .withMessage('Name must be between 2 and 80 characters'),
  body('college').optional().trim().isLength({ max: 120 }).withMessage('College name is too long'),
  body('branch').optional().trim().isLength({ max: 80 }).withMessage('Branch is too long'),
  body('graduationYear')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ min: 1990, max: 2035 })
    .withMessage('Graduation year must be between 1990 and 2035'),
];

export const profileUpdateRules = profileFieldRules;

export const settingsUpdateRules = [
  ...profileFieldRules,
  body('theme').optional().isIn(['light', 'dark']).withMessage('Invalid theme'),
  body('defaultCompany')
    .optional()
    .isIn(['general', 'google', 'amazon', 'microsoft', 'atlassian'])
    .withMessage('Invalid default company'),
  body('interviewDifficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid interview difficulty'),
  body('defaultQuestionCount')
    .optional()
    .isInt({ min: 3, max: 15 })
    .withMessage('Default number of questions must be between 3 and 15'),
];

export const changePasswordRules = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters')
    .matches(/\d/)
    .withMessage('New password must contain at least one number'),
];
