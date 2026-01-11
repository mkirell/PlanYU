import UserService from "../services/userService.js";
import { AppError } from "../errors/index.js";

async function getAllUsers(req, res) {
  try {
    const users = await UserService.list();
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid user ID" });

  try {
    const user = await UserService.get(id);
    res.status(200).json(user);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createUser(req, res) {
  try {
    const created = await UserService.create(req.body);
    res.status(201).json(created);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid user ID" });

  try {
    const updated = await UserService.update(id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid user ID" });

  try {
    const deleted = await UserService.delete(id);
    res.status(200).json(deleted);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
