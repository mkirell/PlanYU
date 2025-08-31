import { Router } from "express";
import {
  getAll,
  get,
  add,
  update,
  remove,
  removeAll,
} from "../controllers/tasks.controller.js";

const router = Router();

router.get("/", getAll);
router.get("/:id", get);
router.post("/", add);
router.patch("/:id", update);
router.delete("/:id", remove);
router.delete("/", removeAll);

export default router;
