import { Router } from 'express';
import { 
  getProgress, 
  completeModule, 
  submitQuizAttempt, 
  submitAssessmentAttempt 
} from '../controllers/progress.controller';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', getProgress);
router.post('/complete-module', completeModule);
router.post('/submit-quiz', submitQuizAttempt);
router.post('/submit-assessment', submitAssessmentAttempt);

export default router;
