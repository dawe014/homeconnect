import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.set("strictQuery", false);

const connectDB = async () => {
  try {
    const mongoURI = process.env.DATABASE_URL;
    if (!mongoURI) {
      console.error("❌ Error: DATABASE_URL is not defined in .env file");
      process.exit(1);
    }

    await mongoose.connect(mongoURI, {
      autoIndex: false,
    });

    console.log("✅ MongoDB connected successfully");

    mongoose.connection.on("connected", () => {
      console.log("📡 Mongoose connected to DB");
    });

    mongoose.connection.on("error", (err) => {
      console.error("⚠️ Mongoose connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      console.log("🔌 Mongoose disconnected");
    });
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("🛑 MongoDB connection closed");
  } catch (error) {
    console.error("Error while closing MongoDB connection:", error);
  }
};

export default connectDB;
