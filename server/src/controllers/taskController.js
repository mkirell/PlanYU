import TaskService from "../services/taskService.js";
import { ValidationError, NotFoundError } from "../errors/errors.js";

export async function getAllTasks(req, res) {
  const tasks = await TaskService.list();
  res.status(200).json(tasks);
}

export async function getTaskById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid task ID");
  const task = await TaskService.get(id);
  if (!task) throw new NotFoundError("Task not found");
  res.status(200).json(task);
}

export async function createTask(req, res) {
  const created = await TaskService.create(req.body);
  res.status(201).json(created);
}

export async function updateTask(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid task ID");
  const updated = await TaskService.update(id, req.body);
  res.status(200).json(updated);
}

export async function deleteTask(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid task ID");
  const deleted = await TaskService.delete(id);
  res.status(200).json(deleted);
}
