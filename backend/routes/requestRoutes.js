import express from 'express';
import { createRequest, getRequests, updateRequestStatus } from '../controllers/requestController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();
router.post('/', protect, createRequest);
router.get('/', protect, getRequests);
router.put('/:id', protect, updateRequestStatus);

export default router;
