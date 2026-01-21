import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorize.js";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

const router = Router();

router.get("/", authorize(), asyncHandler(getAllTasks));
router.get("/:id", authorize("OWNER", "MEMBER"), asyncHandler(getTaskById));
router.post("/", authorize("OWNER"), asyncHandler(createTask));
router.patch("/:id", authorize("OWNER", "MEMBER"), asyncHandler(updateTask));
router.delete("/:id", authorize("OWNER"), asyncHandler(deleteTask));

export default router;
