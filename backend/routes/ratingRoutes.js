import express from 'express';
import { createRating, checkRatingExists, getRatingsByNeeder } from '../controllers/ratingController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/', protect, createRating);
router.get('/:requestId', protect, checkRatingExists);
router.get('/', protect, getRatingsByNeeder);

export default router;
