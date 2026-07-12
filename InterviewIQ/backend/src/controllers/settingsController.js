import ApiError from '../utils/ApiError.js';

const THEME_VALUES = ['light', 'dark'];
const COMPANY_VALUES = ['general', 'google', 'amazon', 'microsoft', 'atlassian'];
const DIFFICULTY_VALUES = ['easy', 'medium', 'hard'];

// PUT /api/settings  (protected)
// Body may include any combination of profile fields and preference fields —
// only the keys present are updated, everything else is left untouched.
export async function updateSettings(req, res, next) {
  try {
    const { name, college, branch, graduationYear, theme, defaultCompany, interviewDifficulty, defaultQuestionCount } =
      req.body;

    if (name !== undefined) req.user.name = name;
    if (college !== undefined) req.user.college = college;
    if (branch !== undefined) req.user.branch = branch;
    if (graduationYear !== undefined) req.user.graduationYear = graduationYear;

    if (theme !== undefined) {
      if (!THEME_VALUES.includes(theme)) {
        throw new ApiError(400, `theme must be one of: ${THEME_VALUES.join(', ')}`);
      }
      req.user.preferences.theme = theme;
    }
    if (defaultCompany !== undefined) {
      if (!COMPANY_VALUES.includes(defaultCompany)) {
        throw new ApiError(400, `defaultCompany must be one of: ${COMPANY_VALUES.join(', ')}`);
      }
      req.user.preferences.defaultCompany = defaultCompany;
    }
    if (interviewDifficulty !== undefined) {
      if (!DIFFICULTY_VALUES.includes(interviewDifficulty)) {
        throw new ApiError(400, `interviewDifficulty must be one of: ${DIFFICULTY_VALUES.join(', ')}`);
      }
      req.user.preferences.interviewDifficulty = interviewDifficulty;
    }
    if (defaultQuestionCount !== undefined) {
      const count = Number(defaultQuestionCount);
      if (!Number.isInteger(count) || count < 3 || count > 15) {
        throw new ApiError(400, 'defaultQuestionCount must be an integer between 3 and 15');
      }
      req.user.preferences.defaultQuestionCount = count;
    }

    await req.user.save();

    res.status(200).json({ success: true, user: req.user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

// POST /api/settings/change-password  (protected)
export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new ApiError(400, 'currentPassword and newPassword are both required');
    }
    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      throw new ApiError(400, 'New password must be at least 8 characters and contain a number');
    }

    // req.user came from protect() without the password field selected —
    // re-fetch with it so comparePassword has something to compare against.
    const userWithPassword = await req.user.constructor.findById(req.user._id).select('+password');

    const isMatch = await userWithPassword.comparePassword(currentPassword);
    if (!isMatch) {
      throw new ApiError(401, 'Current password is incorrect');
    }

    userWithPassword.password = newPassword;
    // Changing the password invalidates every existing session for safety.
    userWithPassword.tokenVersion += 1;
    await userWithPassword.save();

    res.status(200).json({
      success: true,
      message: 'Password updated. Please log in again on all devices.',
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/settings/logout-all-devices  (protected)
export async function logoutAllDevices(req, res, next) {
  try {
    req.user.tokenVersion += 1;
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'You have been logged out from all devices.',
    });
  } catch (err) {
    next(err);
  }
}
