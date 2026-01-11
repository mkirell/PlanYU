import UserTaskService from "../services/userTaskService.js";
import { ValidationError, NotFoundError } from "../errors/errors.js";

export async function getAllUserTasks(req, res) {
  const uts = await UserTaskService.list();
  res.status(200).json(uts);
}

export async function getUserTaskByIds(req, res) {
  const { user_id, task_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !task_id ||
    isNaN(parseInt(task_id))
  )
    throw new ValidationError("Invalid IDs");

  const ut = await UserTaskService.get(user_id, task_id);
  if (!ut) throw new NotFoundError("UserTask not found");
  res.status(200).json(ut);
}

export async function createUserTask(req, res) {
  const ut = await UserTaskService.create(req.body);
  res.status(201).json(ut);
}

export async function updateUserTask(req, res) {
  const { user_id, task_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !task_id ||
    isNaN(parseInt(task_id))
  )
    throw new ValidationError("Invalid IDs");

  const updated = await UserTaskService.update(user_id, task_id, req.body);
  res.status(200).json(updated);
}

export async function deleteUserTask(req, res) {
  const { user_id, task_id } = req.params;
  if (
    !user_id ||
    isNaN(parseInt(user_id)) ||
    !task_id ||
    isNaN(parseInt(task_id))
  )
    throw new ValidationError("Invalid IDs");

  const deleted = await UserTaskService.delete(user_id, task_id);
  res.status(200).json(deleted);
}
