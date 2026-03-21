import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = Router();

router.get(
  "/",
  authorize(PERMISSIONS.PROJECTS.READ),
  asyncHandler(getAllProjects),
);
router.get(
  "/:id",
  authorize(PERMISSIONS.PROJECTS.READ),
  asyncHandler(getProjectById),
);
router.post(
  "/",
  authorize(PERMISSIONS.PROJECTS.CREATE),
  asyncHandler(createProject),
);
router.patch(
  "/:id",
  authorize(PERMISSIONS.PROJECTS.UPDATE),
  asyncHandler(updateProject),
);
router.delete(
  "/:id",
  authorize(PERMISSIONS.PROJECTS.DELETE),
  asyncHandler(deleteProject),
);

export default router;
