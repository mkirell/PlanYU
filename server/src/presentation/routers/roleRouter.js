import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
} from "../controllers/roleController.js";

const router = Router();

router.get("/", authorize(PERMISSIONS.AUTH.MANAGE), asyncHandler(getAllRoles));
router.get(
  "/:role_id",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(getRoleById),
);
router.post("/", authorize(PERMISSIONS.AUTH.MANAGE), asyncHandler(createRole));
router.patch(
  "/:role_id",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(updateRole),
);
router.delete(
  "/:role_id",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(deleteRole),
);

export default router;
