import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  getAllUserProjects,
  getUserProjectByIds,
  createUserProject,
  updateUserProject,
  deleteUserProject,
} from "../controllers/userProjectController.js";

const router = Router();

router.get("/", asyncHandler(getAllUserProjects));
router.get("/:user_id/:project_id", asyncHandler(getUserProjectByIds));
router.post("/", asyncHandler(createUserProject));
router.patch("/:user_id/:project_id", asyncHandler(updateUserProject));
router.delete("/:user_id/:project_id", asyncHandler(deleteUserProject));

export default router;
