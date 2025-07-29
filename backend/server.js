// server.js

import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import xss from 'xss-clean';

// Routes
import authRoutes from './routes/authRoutes.js';
import requestRoutes from './routes/requestRoutes.js';
import ratingRoutes from './routes/ratingRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js'; // ✅ add reviewRoutes

dotenv.config();

// Validate required env variables
const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET'];
requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
});

connectDB();

const app = express();

// Middleware: Security
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Middleware: Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later'
});
app.use(limiter);

// Middleware: Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/requests', requestRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/reviews', reviewRoutes); 

// Health check route
app.get('/', (req, res) => {
  res.send('HelpBridge API is running...');
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Server Error' : err.message;
  res.status(statusCode).json({ message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
