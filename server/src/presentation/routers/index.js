import { Router } from "express";
import authRoutes from "./authRouter.js";
import userRoutes from "./userRouter.js";
import profileRoutes from "./profileRouter.js";
import projectRoutes from "./projectRouter.js";
import taskRoutes from "./taskRouter.js";
import userProjectRoutes from "./userProjectRouter.js";
import userTaskRoutes from "./userTaskRouter.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/projects", projectRoutes);
router.use("/tasks", taskRoutes);
router.use("/user-projects", userProjectRoutes);
router.use("/user-tasks", userTaskRoutes);

export default router;
