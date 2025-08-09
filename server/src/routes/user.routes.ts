import express from "express";
import {
  getAllUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getAgents,
  updateUserProfile,
  changeUserPassword,
} from "../controllers/user.controller";
import { protect, isAdmin } from "../middleware/auth.middleware";
import upload from "../config/multer.config";

const router = express.Router();

router
  .route("/profile")
  .put(protect, upload.single("avatar"), updateUserProfile);

router.route("/profile/password").put(protect, changeUserPassword);
router.route("/agents").get(getAgents);
router.use(protect, isAdmin);

router.route("/").get(getAllUsers);

router.route("/:id").put(updateUserByAdmin).delete(deleteUserByAdmin);

export default router;
