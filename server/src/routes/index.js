import { Router } from "express";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoutes.js";
import profileRoutes from "./profileRoutes.js";
import projectRoutes from "./projectRoutes.js";
import taskRoutes from "./taskRoutes.js";
import userProjectRoutes from "./userProjectRoutes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/user-projects", userProjectRoutes);

export default router;
