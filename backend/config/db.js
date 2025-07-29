import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Mongo Connected");
  } catch (e) {
    console.error("MongoDB connection ERROR!", e.message);
    process.exit(1);
  }
};
