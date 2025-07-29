import Review from '../models/Review.js';
import User from '../models/User.js';
import Request from '../models/Request.js';

export const createReview = async (req, res, next) => {
  try {
    const { requestId, comment } = req.body;

    const request = await Request.findById(requestId).populate('recipient requester');
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (String(req.user._id) !== String(request.requester._id)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if already reviewed
    const already = await Review.findOne({ request: requestId });
    if (already) {
      return res.status(400).json({ message: 'Already reviewed' });
    }

    const review = await Review.create({
      donor: request.recipient._id,
      needer: request.requester._id,
      request: requestId,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    next(err);
  }
};

export const getReviewsForDonor = async (req, res, next) => {
  try {
    const { donorId } = req.params;
    const reviews = await Review.find({ donor: donorId })
      .populate('needer', 'name email')
      .populate('request', 'message')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    next(err);
  }
};

export const getAllDonorReviews = async (req, res, next) => {
  // Optionally all in the system (if you want to show somewhere admin)
  try {
    const reviews = await Review.find()
      .populate('donor', 'name email')
      .populate('needer', 'name email')
      .populate('request', 'message');
    res.json(reviews);
  } catch (err) {
    next(err);
  }
};
