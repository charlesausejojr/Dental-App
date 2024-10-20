import rateLimit from 'express-rate-limit';
import { config } from '../config/index.js';

const apiLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
});

export default apiLimiter;
