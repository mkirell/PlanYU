import { Router } from "express";
import userRoutes from "./userRouter.js";
import profileRoutes from "./profileRouter.js";
import projectRoutes from "./projectRouter.js";
import stageRoutes from "./stageRouter.js";
import taskRoutes from "./taskRouter.js";
import userProjectRoutes from "./userProjectRouter.js";
import userTaskRoutes from "./userTaskRouter.js";
import roleRoutes from "./roleRouter.js";
import permissionRoutes from "./permissionRouter.js";
import userRoleRoutes from "./userRoleRouter.js";
import rolePermissionRoutes from "./rolePermissionRouter.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/profiles", profileRoutes);
router.use("/projects", projectRoutes);
router.use("/stages", stageRoutes);
router.use("/tasks", taskRoutes);
router.use("/user-projects", userProjectRoutes);
router.use("/user-tasks", userTaskRoutes);
router.use("/roles", roleRoutes);
router.use("/permissions", permissionRoutes);
router.use("/", userRoleRoutes);
router.use("/", rolePermissionRoutes);

export default router;
