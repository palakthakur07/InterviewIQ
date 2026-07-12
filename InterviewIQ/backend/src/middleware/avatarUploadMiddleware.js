import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';

const AVATAR_UPLOAD_DIR = path.resolve('uploads', 'avatars');
const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

// Ensure the avatars subdirectory exists — the base uploads/ dir already
// exists (it ships with a .gitkeep), but the avatars/ subfolder does not.
fs.mkdirSync(AVATAR_UPLOAD_DIR, { recursive: true });

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, AVATAR_UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${req.user._id}-${crypto.randomUUID()}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const validExt = ALLOWED_EXTENSIONS.has(ext);
  const validMime = ALLOWED_MIME_TYPES.has(file.mimetype);

  if (!validExt || !validMime) {
    cb(new ApiError(400, 'Only JPG, PNG, or WEBP images are supported for avatars'));
    return;
  }
  cb(null, true);
}

const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_AVATAR_SIZE_BYTES, files: 1 },
});

export default uploadAvatar;
export { AVATAR_UPLOAD_DIR, MAX_AVATAR_SIZE_BYTES };
