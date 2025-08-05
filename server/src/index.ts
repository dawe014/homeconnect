import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
dotenv.config();

// Connect to database
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Make the 'uploads' folder publicly accessible
import path from "path";

// A simple health-check route
app.get("/", (req: Request, res: Response) => {
  res.send("API is running...");
});

// Api routes
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
