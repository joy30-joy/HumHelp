import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  donor:         { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  needer:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  request:       { type: mongoose.Schema.Types.ObjectId, ref: "Request", required: true, unique: true },
  fraudReported: { type: Boolean, required: true }
}, { timestamps: true });

export default mongoose.model("Rating", ratingSchema);
