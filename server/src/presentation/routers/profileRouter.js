import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} from "../controllers/profileController.js";

const router = Router();

router.get(
  "/",
  authorize(PERMISSIONS.PROFILES.READ),
  asyncHandler(getAllProfiles),
);
router.get(
  "/:id",
  authorize(PERMISSIONS.PROFILES.READ),
  asyncHandler(getProfileById),
);
router.post(
  "/",
  authorize(PERMISSIONS.PROFILES.CREATE),
  asyncHandler(createProfile),
);
router.patch(
  "/:id",
  authorize(PERMISSIONS.PROFILES.UPDATE),
  asyncHandler(updateProfile),
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.PROFILES.DELETE),
  asyncHandler(deleteProfile),
);

export default router;
