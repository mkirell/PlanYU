import { Router } from "express";
import {
  getAllUserTasks,
  getUserTaskByIds,
  createUserTask,
  updateUserTask,
  deleteUserTask,
} from "../controllers/userTaskController.js";

const router = Router();

router.get("/", getAllUserTasks);
router.get("/:user_id/:task_id", getUserTaskByIds);
router.post("/", createUserTask);
router.patch("/:user_id/:task_id", updateUserTask);
router.delete("/:user_id/:task_id", deleteUserTask);

export default router;
