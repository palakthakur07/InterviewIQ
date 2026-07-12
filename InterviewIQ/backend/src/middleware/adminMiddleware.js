import ApiError from '../utils/ApiError.js';

// Must be mounted after protect() — relies on req.user being populated.
export default function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    next(new ApiError(403, 'Admin access required'));
    return;
  }
  next();
}
