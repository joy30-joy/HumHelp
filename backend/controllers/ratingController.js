import Rating from '../models/Rating.js';
import Request from '../models/Request.js';
import User from '../models/User.js';

// Create rating for accepted request (needer only)
export const createRating = async (req, res) => {
  const { requestId, fraudReported } = req.body;
  const request = await Request.findById(requestId);

  if (!request) return res.status(404).json({ message: "Request not found" });
  if (req.user.role !== "needer" || request.recipient.toString() !== req.user._id.toString())
    return res.status(403).json({ message: "Not authorized" });
  if (request.status !== "accepted") return res.status(400).json({ message: "Not completed" });

  const already = await Rating.findOne({ request: requestId });
  if (already) return res.status(400).json({ message: "Already rated" });

  // Points logic
  const pointsChange = fraudReported ? -5 : 10;
  await User.findByIdAndUpdate(request.requester, { $inc: { points: pointsChange } });

  const rating = await Rating.create({
    donor: request.requester,
    needer: req.user._id,
    request: requestId,
    fraudReported,
  });
  res.status(201).json(rating);
};

// Check if already rated
export const checkRatingExists = async (req, res) => {
  const rating = await Rating.findOne({ request: req.params.requestId });
  res.json({ exists: !!rating });
};

// For dashboard so we can see all needs rated by this user (optional)
export const getRatingsByNeeder = async (req, res) => {
  const { needer } = req.query;
  const ratings = await Rating.find({ needer });
  res.json(ratings);
};
