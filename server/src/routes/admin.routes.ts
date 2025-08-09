import express from "express";
import { getDashboardStats } from "../controllers/admin.controller";
import { protect, isAdmin } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect, isAdmin);

router.route("/stats").get(getDashboardStats);

export default router;
