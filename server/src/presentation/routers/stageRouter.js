import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getAllStages,
  getStageById,
  createStage,
  updateStage,
  deleteStage,
} from "../controllers/stageController.js";

const router = Router();

router.get("/", authorize(PERMISSIONS.STAGES.READ), asyncHandler(getAllStages));
router.get(
  "/:id",
  authorize(PERMISSIONS.STAGES.READ),
  asyncHandler(getStageById),
);
router.post(
  "/",
  authorize(PERMISSIONS.STAGES.CREATE),
  asyncHandler(createStage),
);
router.patch(
  "/:id",
  authorize(PERMISSIONS.STAGES.UPDATE),
  asyncHandler(updateStage),
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.STAGES.DELETE),
  asyncHandler(deleteStage),
);

export default router;
