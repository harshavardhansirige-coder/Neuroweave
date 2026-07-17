import rateLimit from 'express-rate-limit';

// Standard rate limiter for general routes (100 requests per 15 minutes)
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    error: 'Rate limit exceeded'
  }
});

// Stricter rate limiter for expensive AI generation endpoints (15 requests per 15 minutes)
export const aiGenerationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    data: null,
    message: 'Too many learning generation requests, please try again after 15 minutes.',
    error: 'Rate limit exceeded'
  }
});
