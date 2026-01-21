import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorize.js";
import {
  getAllUserTasks,
  getUserTaskByIds,
  createUserTask,
  updateUserTask,
  deleteUserTask,
} from "../controllers/userTaskController.js";

const router = Router();

router.get("/", authorize(), asyncHandler(getAllUserTasks));
router.get(
  "/:user_id/:task_id",
  authorize("OWNER", "MEMBER"),
  asyncHandler(getUserTaskByIds),
);
router.post("/", authorize("OWNER"), asyncHandler(createUserTask));
router.patch(
  "/:user_id/:task_id",
  authorize("OWNER"),
  asyncHandler(updateUserTask),
);
router.delete(
  "/:user_id/:task_id",
  authorize("OWNER"),
  asyncHandler(deleteUserTask),
);

export default router;
