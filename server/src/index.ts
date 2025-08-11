import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors, { CorsOptions } from "cors";
import path from "path";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import connectDB, { disconnectDB } from "./config/db";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import userRoutes from "./routes/user.routes";
import adminRoutes from "./routes/admin.routes";
import agentRoutes from "./routes/agent.routes";
import contactRoutes from "./routes/contact.routes";

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Security middlewares
app.use(helmet());
app.use(compression());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 100, // limit each IP to 100 requests per window
    message: { message: "Too many requests, please try again later." },
  })
);

// CORS configuration
const clientURL = process.env.CLIENT_URL || "*";
const corsOptions: CorsOptions = {
  origin: NODE_ENV === "production" ? clientURL : "*",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/agent", agentRoutes);
app.use("/api/contact", contactRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "API is running..." });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  res.status(500).json({
    message: NODE_ENV === "production" ? "Internal Server Error" : err.message,
  });
});

// Start server after DB connection
(async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(
        `[server]: Server running in ${NODE_ENV} mode at http://localhost:${PORT}`
      );
    });

    // Graceful shutdown
    process.on("SIGTERM", async () => {
      console.log("SIGTERM received: closing server...");
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });

    process.on("SIGINT", async () => {
      console.log("SIGINT received: closing server...");
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
})();
