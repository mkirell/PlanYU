import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getAllUserProjects,
  getUserProjectByIds,
  createUserProject,
  updateUserProject,
  deleteUserProject,
} from "../controllers/userProjectController.js";

const router = Router();

router.get("/", authorize(PERMISSIONS.USER_PROJECTS.READ), asyncHandler(getAllUserProjects));
router.get(
  "/:user_id/:project_id",
  authorize(PERMISSIONS.USER_PROJECTS.READ),
  asyncHandler(getUserProjectByIds),
);
router.post("/", authorize(PERMISSIONS.USER_PROJECTS.CREATE), asyncHandler(createUserProject));
router.patch(
  "/:user_id/:project_id",
  authorize(PERMISSIONS.USER_PROJECTS.UPDATE),
  asyncHandler(updateUserProject),
);
router.delete(
  "/:user_id/:project_id",
  authorize(PERMISSIONS.USER_PROJECTS.DELETE),
  asyncHandler(deleteUserProject),
);

export default router;
