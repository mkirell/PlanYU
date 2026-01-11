import UserService from "../services/userService.js";
import { ValidationError, NotFoundError } from "../errors/errors.js";

export async function getAllUsers(req, res) {
  const users = await UserService.list();
  res.status(200).json(users);
}

export async function getUserById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid user ID");
  const user = await UserService.get(id);
  if (!user) throw new NotFoundError("User not found");
  res.status(200).json(user);
}

export async function createUser(req, res) {
  const created = await UserService.create(req.body);
  res.status(201).json(created);
}

export async function updateUser(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid user ID");
  const updated = await UserService.update(id, req.body);
  res.status(200).json(updated);
}

export async function deleteUser(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id))) throw new ValidationError("Invalid user ID");
  const deleted = await UserService.delete(id);
  res.status(200).json(deleted);
}
