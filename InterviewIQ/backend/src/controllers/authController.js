import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import ApiError from '../utils/ApiError.js';

// POST /api/auth/signup
export async function signup(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      throw new ApiError(409, 'An account with that email already exists');
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id, user.tokenVersion);

    res.status(201).json({
      success: true,
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/auth/login
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw new ApiError(401, 'Invalid email or password');
    }

    const token = generateToken(user._id, user.tokenVersion);

    res.status(200).json({
      success: true,
      token,
      user: user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}

// GET /api/auth/me  (protected)
export async function me(req, res, next) {
  try {
    res.status(200).json({
      success: true,
      user: req.user.toPublicJSON(),
    });
  } catch (err) {
    next(err);
  }
}
