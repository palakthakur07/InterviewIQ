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

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}
