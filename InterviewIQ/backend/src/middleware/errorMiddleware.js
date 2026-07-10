import ApiError from '../utils/ApiError.js';
import fs from 'fs';

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  // If a file was uploaded (e.g. by multer) but a later step failed
  // (DB down, auth failed, parsing failed), don't leave it orphaned on disk.
  if (req.file?.path) {
    fs.unlink(req.file.path, () => {});
  }

  let { statusCode, message } = err;
  let details = err.details || null;

  // Multer upload errors (file too large, wrong field name, etc.)
  if (err.name === 'MulterError') {
    statusCode = 400;
    message =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File is too large. Maximum size is 5MB.'
        : `Upload error: ${err.message}`;
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    statusCode = 400;
    details = Object.values(err.errors).map((e) => e.message);
    message = 'Validation failed';
  }

  // Mongoose duplicate key error (e.g. email already registered)
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `An account with that ${field} already exists`;
  }

  // Malformed ObjectId
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired, please log in again';
  }

  statusCode = statusCode && statusCode >= 400 ? statusCode : 500;

  if (statusCode === 500) {
    console.error('[error]', err);
  }

  res.status(statusCode).json({
    success: false,
    message: message || 'Something went wrong on our end',
    ...(details ? { details } : {}),
  });
}
