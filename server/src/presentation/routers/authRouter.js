import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", authorize(), asyncHandler(register));
router.post("/login", authorize(), asyncHandler(login));
router.post("/refresh", authorize(), asyncHandler(refresh));
router.post("/logout", authorize(), asyncHandler(logout));

export default router;
