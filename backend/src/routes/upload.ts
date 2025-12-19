import { Router } from 'express';
import fileMiddleware from '../middlewares/file';
import tokenMiddleware from '../middlewares/token';
import { uploadFile } from '../controllers/upload';

const router = Router();

router.post('/', tokenMiddleware, fileMiddleware.single('file'), uploadFile);

export default router;
