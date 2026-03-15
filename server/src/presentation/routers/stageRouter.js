import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import {
  getAllStages,
  getStageById,
  createStage,
  updateStage,
  deleteStage,
} from "../controllers/stageController.js";

const router = Router();

router.get("/", authorize("OWNER", "MEMBER"), asyncHandler(getAllStages));
router.get("/:id", authorize("OWNER", "MEMBER"), asyncHandler(getStageById));
router.post("/", authorize("OWNER"), asyncHandler(createStage));
router.patch("/:id", authorize("OWNER"), asyncHandler(updateStage));
router.delete("/:id", authorize("OWNER"), asyncHandler(deleteStage));

export default router;
