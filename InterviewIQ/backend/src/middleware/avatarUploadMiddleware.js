import multer from 'multer';
import path from 'path';
import ApiError from '../utils/ApiError.js';

const MAX_AVATAR_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const storage = multer.memoryStorage();

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
export { MAX_AVATAR_SIZE_BYTES };