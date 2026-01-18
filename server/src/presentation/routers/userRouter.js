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

router.get("/", asyncHandler(getAllUsers));
router.get("/:id", authorize("ADMIN"), asyncHandler(getUserById));
router.post("/", authorize("ADMIN"), asyncHandler(createUser));
router.patch("/:id", authorize("ADMIN"), asyncHandler(updateUser));
router.delete("/:id", authorize("ADMIN"), asyncHandler(deleteUser));

export default router;
