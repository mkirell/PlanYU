import { Router } from "express";
import asyncHandler from "../middleware/asyncHandler.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.get("/", asyncHandler(getAllUsers));
router.get("/:id", asyncHandler(getUserById));
router.post("/", asyncHandler(createUser));
router.patch("/:id", asyncHandler(updateUser));
router.delete("/:id", asyncHandler(deleteUser));

export default router;
