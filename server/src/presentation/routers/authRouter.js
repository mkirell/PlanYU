import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/refresh", asyncHandler(refresh));
router.post("/logout", asyncHandler(logout));

export default router;
