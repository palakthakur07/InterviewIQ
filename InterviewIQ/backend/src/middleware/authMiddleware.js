import jwt from 'jsonwebtoken';
import ApiError from '../utils/ApiError.js';
import User from '../models/User.js';

export default async function protect(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;

    if (!token) {
      throw new ApiError(401, 'Not authorized — no token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.sub);

    if (!user) {
      throw new ApiError(401, 'Not authorized — user no longer exists');
    }

    // A mismatched tokenVersion means this token was issued before the most
    // recent password change or "logout from all devices" — treat it the
    // same way an expired token is treated.
    if ((decoded.tv ?? 0) !== user.tokenVersion) {
      throw new ApiError(401, 'Session expired, please log in again');
    }

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
