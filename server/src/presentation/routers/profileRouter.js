import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorize.js";
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController.js";

const router = Router();

router.get("/", authorize(), asyncHandler(getAllProfiles));
router.get("/:id", authorize(), asyncHandler(getProfileById));
router.post("/", authorize("SELF"), asyncHandler(createProfile));
router.patch("/:id", authorize("SELF"), asyncHandler(updateProfile));
router.delete("/:id", authorize("SELF"), asyncHandler(deleteProfile));

export default router;
