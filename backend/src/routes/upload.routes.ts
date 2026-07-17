import { Router } from 'express';
import { handleUpload } from '../controllers/upload.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', handleUpload);

export default router;
