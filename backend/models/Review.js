import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    needer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    request: { type: mongoose.Schema.Types.ObjectId, ref: 'Request', required: true },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  }
);

export default mongoose.model('Review', reviewSchema);
