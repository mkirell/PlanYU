import { Router } from "express";
import { register, login, getAllUsers } from "../controllers/userController.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/", getAllUsers);

export default router;
