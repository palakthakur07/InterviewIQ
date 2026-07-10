import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import ApiError from '../utils/ApiError.js';

const UPLOAD_DIR = path.resolve('uploads');
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]);
const ALLOWED_EXTENSIONS = new Set(['.pdf', '.docx']);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${crypto.randomUUID()}${ext}`);
  },
});

function fileFilter(req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const validExt = ALLOWED_EXTENSIONS.has(ext);
  const validMime = ALLOWED_MIME_TYPES.has(file.mimetype);

  if (!validExt || !validMime) {
    cb(new ApiError(400, 'Only PDF and DOCX resumes are supported'));
    return;
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
});

export default upload;
export { UPLOAD_DIR, MAX_FILE_SIZE_BYTES };
