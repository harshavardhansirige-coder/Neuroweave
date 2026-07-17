import { Router } from 'express';
import authRoutes from './auth.routes';
import learningRoutes from './learning.routes';
import chatRoutes from './chat.routes';
import uploadRoutes from './upload.routes';
import progressRoutes from './progress.routes';

const router = Router();

// Aggregate all routes under their corresponding namespaces
router.use('/auth', authRoutes);
router.use('/', learningRoutes); // matches /api/progress, /api/courses, etc.
router.use('/chat', chatRoutes);
router.use('/upload', uploadRoutes);
router.use('/progress', progressRoutes);

export default router;
