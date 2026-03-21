import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
} from "../controllers/permissionController.js";

const router = Router();

router.get(
  "/",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(getAllPermissions),
);
router.get(
  "/:permission_id",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(getPermissionById),
);
router.post(
  "/",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(createPermission),
);
router.patch(
  "/:permission_id",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(updatePermission),
);
router.delete(
  "/:permission_id",
  authorize(PERMISSIONS.AUTH.MANAGE),
  asyncHandler(deletePermission),
);

export default router;
