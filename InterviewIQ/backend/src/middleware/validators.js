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
