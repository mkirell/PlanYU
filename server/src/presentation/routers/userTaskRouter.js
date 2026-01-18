import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import {
  getAllUserTasks,
  getUserTaskByIds,
  createUserTask,
  updateUserTask,
  deleteUserTask,
} from "../controllers/userTaskController.js";

const router = Router();

router.get("/", asyncHandler(getAllUserTasks));
router.get("/:user_id/:task_id", asyncHandler(getUserTaskByIds));
router.post("/", asyncHandler(createUserTask));
router.patch("/:user_id/:task_id", asyncHandler(updateUserTask));
router.delete("/:user_id/:task_id", asyncHandler(deleteUserTask));

export default router;
