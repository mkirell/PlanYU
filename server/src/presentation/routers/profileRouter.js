import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController.js";

const router = Router();

router.get("/", asyncHandler(getAllProfiles));
router.get("/:id", asyncHandler(getProfileById));
router.post("/", asyncHandler(createProfile));
router.patch("/:id", asyncHandler(updateProfile));
router.delete("/:id", asyncHandler(deleteProfile));

export default router;
