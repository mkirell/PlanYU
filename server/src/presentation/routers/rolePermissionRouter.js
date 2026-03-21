import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getRolePermissions,
  assignRolePermission,
  replaceRolePermissions,
} from "../controllers/rolePermissionController.js";

const router = Router();

router.get(
  "/roles/:role_id/permissions",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(getRolePermissions),
);
router.post(
  "/roles/:role_id/permissions",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(assignRolePermission),
);
router.put(
  "/roles/:role_id/permissions",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(replaceRolePermissions),
);

export default router;
