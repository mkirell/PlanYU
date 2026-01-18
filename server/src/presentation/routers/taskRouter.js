import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = Router();

router.get("/", asyncHandler(getAllTasks));
router.get("/:id", asyncHandler(getTaskById));
router.post("/", asyncHandler(createTask));
router.patch("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
