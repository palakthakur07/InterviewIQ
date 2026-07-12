import fs from 'fs/promises';
import path from 'path';
import User from '../models/User.js';
import Interview from '../models/Interview.js';
import Resume from '../models/Resume.js';
import ApiError from '../utils/ApiError.js';
import { AVATAR_UPLOAD_DIR } from '../middleware/avatarUploadMiddleware.js';

/**
 * Aggregates the stats shown on the Profile page — kept separate from
 * toPublicJSON() since these are derived from other collections, not
 * stored on the User document itself.
 */
async function computeProfileStats(userId) {
  const [interviews, resumes] = await Promise.all([
    Interview.find({ user: userId }),
    Resume.find({ user: userId }).sort({ createdAt: -1 }),
  ]);

  const scored = interviews.filter((i) => i.overallScore !== null);
  const averageScore = scored.length
    ? Math.round((scored.reduce((sum, i) => sum + i.overallScore, 0) / scored.length) * 10) / 10
    : null;
  const bestScore = scored.length ? Math.max(...scored.map((i) => i.overallScore)) : null;

  const companiesPracticed = [...new Set(interviews.map((i) => i.company))];

  const skillsDetected = [
    ...new Set(resumes.flatMap((r) => [...r.skills, ...r.technologies])),
  ].slice(0, 30);

  return {
    totalInterviews: interviews.length,
    averageScore,
    bestScore,
    companiesPracticed,
    skillsDetected,
  };
}

// GET /api/profile  (protected)
export async function getProfile(req, res, next) {
  try {
    const stats = await computeProfileStats(req.user._id);
    res.status(200).json({
      success: true,
      user: req.user.toPublicJSON(),
      stats,
    });
  } catch (err) {
    next(err);
  }
}

// PUT /api/profile  (protected)
export async function updateProfile(req, res, next) {
  try {
    const { name, college, branch, graduationYear } = req.body;

    if (name !== undefined) req.user.name = name;
    if (college !== undefined) req.user.college = college;
    if (branch !== undefined) req.user.branch = branch;
    if (graduationYear !== undefined) req.user.graduationYear = graduationYear;

    await req.user.save();

    res.status(200).json({ success: true, user: req.user.toPublicJSON() });
  } catch (err) {
    next(err);
  }
}

// POST /api/profile/avatar  (protected, multipart/form-data, field name "avatar")
export async function uploadAvatar(req, res, next) {
  const file = req.file;

  try {
    if (!file) {
      throw new ApiError(400, 'No image was uploaded. Attach a JPG, PNG, or WEBP under "avatar".');
    }

    // Remove the previous avatar file from disk, if any, so orphans don't pile up.
    if (req.user.avatarUrl) {
      const oldFileName = path.basename(req.user.avatarUrl);
      const oldPath = path.join(AVATAR_UPLOAD_DIR, oldFileName);
      fs.unlink(oldPath).catch(() => {});
    }

    req.user.avatarUrl = `/uploads/avatars/${file.filename}`;
    await req.user.save();

    res.status(200).json({ success: true, user: req.user.toPublicJSON() });
  } catch (err) {
    if (file?.path) {
      fs.unlink(file.path).catch(() => {});
    }
    next(err);
  }
}
