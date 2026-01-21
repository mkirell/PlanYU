import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorize.js";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = Router();

router.get("/", authorize(), asyncHandler(getAllUsers));
router.get("/:id", authorize("ADMIN", "SELF"), asyncHandler(getUserById));
router.post("/", authorize("ADMIN"), asyncHandler(createUser));
router.patch("/:id", authorize("ADMIN", "SELF"), asyncHandler(updateUser));
router.delete("/:id", authorize("ADMIN", "SELF"), asyncHandler(deleteUser));

export default router;
