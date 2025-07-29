import express from 'express';
import { createReview, getReviewsForDonor } from '../controllers/reviewController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Needer posts review for a donor after accepted request
router.post('/', protect, createReview);

// All needers can see reviews for any donor
router.get('/:donorId', protect, getReviewsForDonor);

export default router;
