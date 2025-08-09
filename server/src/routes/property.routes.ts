import express from "express";
import {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
  getMyListings,
  getAllPropertiesForAdmin,
  togglePropertyAvailability,
} from "../controllers/property.controller";
import { protect, isAgent, isAdmin } from "../middleware/auth.middleware";
import upload from "../config/multer.config";

const router = express.Router();

// Public routes
router.route("/").get(getProperties);
router.route("/all").get(protect, isAdmin, getAllPropertiesForAdmin);

// Private agent routes
router.route("/my-listings").get(protect, isAgent, getMyListings); // This MUST be before /:id

router.route("/:id").get(getPropertyById);

// Private/Protected routes
router
  .route("/")
  .post(protect, isAgent, upload.array("images", 5), createProperty);
router
  .route("/:id")
  .put(protect, isAgent, upload.array("images", 5), updateProperty)
  .delete(protect, isAgent, deleteProperty);
router
  .route("/:id/toggle-availability")
  .patch(protect, isAgent, togglePropertyAvailability);

export default router;
