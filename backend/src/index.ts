import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes';
import { initializeFirebase } from './config/firebase';
import { standardLimiter } from './middleware/rate-limiter';
import { sendSuccess } from './utils/response';

// 1. Load Environment Variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 2. Initialize Firebase Admin SDK
initializeFirebase();

// 3. Configure Express Middlewares
app.use(cors({
  origin: '*', // Allow all client origins in development, restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-client-info', 'apikey']
}));

app.use(express.json({ limit: '20mb' })); // Allow higher limits for base64 file uploads
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// 4. Rate Limiting Middleware
app.use(standardLimiter);

// 5. Health Check Endpoint
app.get('/health', (req, res) => {
  return sendSuccess(res, { status: 'healthy', timestamp: new Date().toISOString() }, 'LearnForge AI Backend is online.');
});

// 6. Mount API Router under '/api' prefix
app.use('/api', apiRouter);

// 7. Global 404 Route handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    data: null,
    message: `Cannot ${req.method} ${req.originalUrl}. Route not found.`,
    error: 'Not Found'
  });
});

// 8. Launch Listening Server
app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 LearnForge AI Backend running on port ${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api`);
  console.log(`====================================================`);
});

export default app;
