import { Router } from "express";
import {
  getAllUserProjects,
  getUserProject,
  createUserProject,
  updateUserProject,
  deleteUserProject,
} from "../controllers/userProjectController.js";

const router = Router();

router.get("/", getAllUserProjects);
router.get("/:user_id/:project_id", getUserProject);
router.post("/", createUserProject);
router.patch("/:user_id/:project_id", updateUserProject);
router.delete("/:user_id/:project_id", deleteUserProject);

export default router;
