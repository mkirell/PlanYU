import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = Router();

router.get("/", asyncHandler(getAllProjects));
router.get("/:id", asyncHandler(getProjectById));
router.post("/", asyncHandler(createProject));
router.patch("/:id", asyncHandler(updateProject));
router.delete("/:id", asyncHandler(deleteProject));

export default router;
