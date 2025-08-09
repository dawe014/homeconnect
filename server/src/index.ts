import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import agentRoutes from "./routes/agent.routes";
import contactRoutes from "./routes/contact.routes";

dotenv.config();

// Connect to database
connectDB();

const app: Express = express();
const PORT = process.env.PORT || 8000;

const clientURL = process.env.CLIENT_URL;

const corsOptions = {
  origin: clientURL,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Make the 'uploads' folder publicly accessible
import path from "path";

// Api routes
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/contact", contactRoutes);
app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});
