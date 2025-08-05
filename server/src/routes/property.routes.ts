import express from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
} from "../controllers/property.controller";
import { protect, isAgent } from "../middleware/auth.middleware";
import upload from "../config/multer.config";

const router = express.Router();

// Public routes
router.route("/").get(getProperties);
router.route("/:id").get(getPropertyById);

// Private/Protected routes
router
  .route("/")
  .post(protect, isAgent, upload.array("images", 5), createProperty);

export default router;
