import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.DATABASE_URL;
    if (!mongoURI) {
      console.error("Error: DATABASE_URL is not defined in .env file");
      process.exit(1);
    }

    await mongoose.connect(mongoURI);

    console.log("[database]: MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

export default connectDB;
