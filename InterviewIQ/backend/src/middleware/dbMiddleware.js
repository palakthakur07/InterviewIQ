import mongoose from 'mongoose';
import ApiError from '../utils/ApiError.js';

// Fail fast instead of letting Mongoose buffer/hang when the DB isn't reachable.
// Routed through next(err) -> errorHandler so behavior (status shape, file
// cleanup on upload routes) stays consistent with every other error path.
export default function requireDB(req, res, next) {
  if (mongoose.connection.readyState !== 1) {
    next(
      new ApiError(
        503,
        'Database is not connected. Check the server MONGO_URI configuration.',
      ),
    );
    return;
  }
  next();
}
