import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getAllUserTasks,
  getUserTaskByIds,
  createUserTask,
  updateUserTask,
  deleteUserTask,
} from "../controllers/userTaskController.js";

const router = Router();

router.get("/", authorize(PERMISSIONS.USER_TASKS.READ), asyncHandler(getAllUserTasks));
router.get(
  "/:user_id/:task_id",
  authorize(PERMISSIONS.USER_TASKS.READ),
  asyncHandler(getUserTaskByIds),
);
router.post("/", authorize(PERMISSIONS.USER_TASKS.CREATE), asyncHandler(createUserTask));
router.patch(
  "/:user_id/:task_id",
  authorize(PERMISSIONS.USER_TASKS.UPDATE),
  asyncHandler(updateUserTask),
);
router.delete(
  "/:user_id/:task_id",
  authorize(PERMISSIONS.USER_TASKS.DELETE),
  asyncHandler(deleteUserTask),
);

export default router;
