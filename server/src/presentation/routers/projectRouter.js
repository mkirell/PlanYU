import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorize.js";
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";

const router = Router();

router.get("/", authorize(), asyncHandler(getAllProjects));
router.get("/:id", authorize("OWNER", "MEMBER"), asyncHandler(getProjectById));
router.post("/", authorize(), asyncHandler(createProject));
router.patch("/:id", authorize("OWNER"), asyncHandler(updateProject));
router.delete("/:id", authorize("OWNER"), asyncHandler(deleteProject));

export default router;
