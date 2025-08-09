import express from "express";
import { getAgentDashboardStats } from "../controllers/agent.controller";
import { protect, isAgent } from "../middleware/auth.middleware";

const router = express.Router();

router.use(protect, isAgent);

router.route("/stats").get(getAgentDashboardStats);

export default router;
