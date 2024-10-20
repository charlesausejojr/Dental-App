import dotenv from 'dotenv';
dotenv.config(); // Load environment variables

export const config = {
  email: {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 500, // Max 500 requests per IP
  },
};
