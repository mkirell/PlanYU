import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import PERMISSIONS from "../authorization/permissions.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.get("/", authorize(PERMISSIONS.USERS.READ), asyncHandler(getAllUsers));
router.get("/:id", authorize(PERMISSIONS.USERS.READ), asyncHandler(getUserById));
router.post("/", authorize(PERMISSIONS.USERS.CREATE), asyncHandler(createUser));
router.patch("/:id", authorize(PERMISSIONS.USERS.UPDATE), asyncHandler(updateUser));
router.delete("/:id", authorize(PERMISSIONS.USERS.DELETE), asyncHandler(deleteUser));

export default router;
