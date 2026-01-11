import TaskService from "../services/taskService.js";
import { AppError } from "../errors/index.js";

async function getAllTasks(req, res) {
  try {
    const tasks = await TaskService.list();
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getTaskById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid task ID" });

  try {
    const task = await TaskService.get(id);
    res.status(200).json(task);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error fetching task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createTask(req, res) {
  try {
    const created = await TaskService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error creating task:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateTask(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid task ID" });

  try {
    const updated = await TaskService.update(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid task ID" });

  try {
    const deleted = await TaskService.delete(id);
    res.status(200).json(deleted);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
