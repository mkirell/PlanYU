import { Router } from "express";
import asyncHandler from "../../presentation/middleware/asyncHandler.js";
import authorize from "../middleware/authorization.js";
import {
  register,
  login,
  refresh,
  logout,
  verifyCode,
  resendCode,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", authorize(), asyncHandler(register));
router.post("/login", authorize(), asyncHandler(login));
router.post("/refresh", authorize(), asyncHandler(refresh));
router.post("/logout", authorize(), asyncHandler(logout));
router.post("/verify-code", authorize(), asyncHandler(verifyCode));
router.post("/resend-code", authorize(), asyncHandler(resendCode));

export default router;
