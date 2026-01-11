import UserTaskService from "../services/userTaskService.js";
import { AppError } from "../errors/index.js";

async function getAllUserTasks(req, res) {
  try {
    const uts = await UserTaskService.list();
    res.status(200).json(uts);
  } catch (err) {
    console.error("Error fetching user-tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserTaskByIds(req, res) {
  const { user_id, task_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !task_id ||
    isNaN(parseInt(task_id))
  )
    return res.status(400).json({ warning: "Invalid IDs" });

  try {
    const ut = await UserTaskService.get(user_id, task_id);
    res.status(200).json(ut);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error fetching user-task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createUserTask(req, res) {
  try {
    const ut = await UserTaskService.create(req.body);
    res.status(201).json(ut);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error creating user-task:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateUserTask(req, res) {
  const { user_id, task_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !task_id ||
    isNaN(parseInt(task_id))
  )
    return res.status(400).json({ warning: "Invalid IDs" });

  try {
    const updated = await UserTaskService.update(user_id, task_id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error updating user-task:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteUserTask(req, res) {
  const { user_id, task_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !task_id ||
    isNaN(parseInt(task_id))
  )
    return res.status(400).json({ warning: "Invalid IDs" });

  try {
    const deleted = await UserTaskService.delete(user_id, task_id);
    res.status(200).json(deleted);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error deleting user-task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  getAllUserTasks,
  getUserTaskByIds,
  createUserTask,
  updateUserTask,
  deleteUserTask,
};
