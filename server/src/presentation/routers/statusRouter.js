import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import {
  getAllStatuses,
  getStatusById,
  createStatus,
  updateStatus,
  deleteStatus,
} from "../controllers/statusController.js";

const router = Router();

router.get("/", authorize("OWNER", "MEMBER"), asyncHandler(getAllStatuses));
router.get("/:id", authorize("OWNER", "MEMBER"), asyncHandler(getStatusById));
router.post("/", authorize("OWNER"), asyncHandler(createStatus));
router.patch("/:id", authorize("OWNER"), asyncHandler(updateStatus));
router.delete("/:id", authorize("OWNER"), asyncHandler(deleteStatus));

export default router;
