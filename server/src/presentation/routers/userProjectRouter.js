import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import {
  getAllUserProjects,
  getUserProjectByIds,
  createUserProject,
  updateUserProject,
  deleteUserProject,
} from "../controllers/userProjectController.js";

const router = Router();

router.get("/", authorize(), asyncHandler(getAllUserProjects));
router.get(
  "/:user_id/:project_id",
  authorize("OWNER", "MEMBER"),
  asyncHandler(getUserProjectByIds),
);
router.post("/", authorize("OWNER"), asyncHandler(createUserProject));
router.patch(
  "/:user_id/:project_id",
  authorize("OWNER"),
  asyncHandler(updateUserProject),
);
router.delete(
  "/:user_id/:project_id",
  authorize("OWNER"),
  asyncHandler(deleteUserProject),
);

export default router;
