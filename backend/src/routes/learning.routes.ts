import { Router } from 'express';
import { 
  generateLearning, 
  generateCourse, 
  generateNotes, 
  generateQuiz, 
  generateFlashcards, 
  generateRoadmap,
  getCourses,
  getSessions,
  getSessionById
} from '../controllers/learning.controller';
import { authMiddleware } from '../middleware/auth';
import { aiGenerationLimiter } from '../middleware/rate-limiter';

const router = Router();

// Apply auth middleware to protect all learning routes
router.use(authMiddleware);

// Active multi-agent generator
router.post('/generate-learning', aiGenerationLimiter, generateLearning);

// Specialized individual generators
router.post('/generate-course', generateCourse);
router.post('/generate-notes', generateNotes);
router.post('/generate-quiz', generateQuiz);
router.post('/generate-flashcards', generateFlashcards);
router.post('/generate-roadmap', generateRoadmap);

// Content fetchers
router.get('/courses', getCourses);
router.get('/sessions', getSessions);
router.get('/sessions/:id', getSessionById);

export default router;
