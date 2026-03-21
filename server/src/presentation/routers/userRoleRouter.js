import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getUserRoles,
  assignUserRole,
  replaceUserRoles,
} from "../controllers/userRoleController.js";

const router = Router();

router.get(
  "/users/:user_id/roles",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(getUserRoles),
);
router.post(
  "/users/:user_id/roles",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(assignUserRole),
);
router.put(
  "/users/:user_id/roles",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(replaceUserRoles),
);

export default router;
