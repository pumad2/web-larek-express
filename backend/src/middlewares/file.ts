import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import config from '../config';

const tempDir = path.join(process.cwd(), 'public', config.UPLOAD_PATH_TEMP);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, tempDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = crypto.randomBytes(8).toString('hex');
    cb(null, `${name}${ext}`);
  },
});

const allowed = new Set([
  'image/png',
  'image/jpeg',
  'image/jpg',
  'image/webp',
  'image/gif',
]);

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  if (!allowed.has(file.mimetype)) {
    cb(new Error('Недопустимый тип файла'));
    return;
  }
  cb(null, true);
};

const fileMiddleware = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
});

export default fileMiddleware;
