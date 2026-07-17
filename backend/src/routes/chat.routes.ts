import { Router } from 'express';
import { handleChat, getChatHistory } from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', handleChat);
router.get('/history/:sessionId', getChatHistory);

export default router;
