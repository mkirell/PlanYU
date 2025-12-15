import { Task } from "../models/index.js";

async function getAllTasks(req, res) {
  try {
    const tasks = await Task.findAll({ order: [["task_id", "ASC"]] });
    res.status(200).json({ data: tasks });
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
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ warning: "Task not found" });
    res.status(200).json({ data: task });
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createTask(req, res) {
  const { title, project_id } = req.body;
  if (!title || !project_id)
    return res.status(400).json({ warning: "Task title and project required" });

  try {
    const task = await Task.create(req.body);
    res.status(201).json({ data: task });
  } catch (err) {
    console.error("Error creating task:", err);
    res.status(500).json({ error: err.message });
  }
}

async function updateTask(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid task ID" });

  try {
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ warning: "Task not found" });

    const updated = await task.update(req.body);
    res.status(200).json({ data: updated });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteTask(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid task ID" });

  try {
    const task = await Task.findByPk(id);
    if (!task) return res.status(404).json({ warning: "Task not found" });

    await task.destroy();
    res.status(204).send();
    res.status(200).json({ message: `Task ${id} deleted` });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
