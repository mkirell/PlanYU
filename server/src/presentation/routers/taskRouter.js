import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = Router();

router.get("/", authorize(PERMISSIONS.TASKS.READ), asyncHandler(getAllTasks));
router.get(
  "/:id",
  authorize(PERMISSIONS.TASKS.READ),
  asyncHandler(getTaskById),
);
router.post("/", authorize(PERMISSIONS.TASKS.CREATE), asyncHandler(createTask));
router.patch(
  "/:id",
  authorize(PERMISSIONS.TASKS.UPDATE),
  asyncHandler(updateTask),
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.TASKS.DELETE),
  asyncHandler(deleteTask),
);

export default router;
