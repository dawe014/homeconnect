import express from "express";
import {
  submitContactForm,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from "../controllers/contact.controller";
import { protect, isAdmin } from "../middleware/auth.middleware";
const router = express.Router();

router.route("/").post(submitContactForm);

// --- Admin Only Routes ---
router.route("/").get(protect, isAdmin, getContactMessages);

router.route("/:id").delete(protect, isAdmin, deleteContactMessage);

router.route("/:id/read").patch(protect, isAdmin, markMessageAsRead);
export default router;
