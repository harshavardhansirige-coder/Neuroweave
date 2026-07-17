import { Router } from 'express';
import { login, logout, getUserProfile, updateSettings } from '../controllers/auth.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// Public auth routes (middleware verification happens inside controllers if needed, or inline)
// To verify the token first before profile syncing:
router.post('/login', authMiddleware, login);
router.post('/logout', authMiddleware, logout);
router.get('/user', authMiddleware, getUserProfile);
router.put('/settings', authMiddleware, updateSettings);

export default router;
