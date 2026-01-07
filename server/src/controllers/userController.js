import bcrypt from "bcrypt";
import { User } from "../models/index.js";

async function getAllUsers(req, res) {
  try {
    const users = await User.findAll({ attributes: ["user_id", "email"] });
    res.status(200).json({ data: users });
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
    const user = await User.findByPk(id, { attributes: ["user_id", "email"] });
    if (!user) return res.status(404).json({ warning: "User not found" });
    res.status(200).json({ data: user });
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function createUser(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ warning: "Email and password required" });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ warning: "Email already exists" });
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await User.create({ email, password_hash });

    res.status(201).json({ data: { user_id: user.user_id } });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function updateUser(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid user ID" });

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ warning: "User not found" });

    if (req.body.password) {
      req.body.password_hash = await bcrypt.hash(req.body.password, 10);
      delete req.body.password;
    }

    const updated = await user.update(req.body);
    res
      .status(200)
      .json({ data: { user_id: updated.user_id, email: updated.email } });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ error: err.message });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)))
    return res.status(400).json({ warning: "Invalid user ID" });

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ warning: "User not found" });

    await user.destroy();
    res.status(200).json({ message: `User ${id} deleted` });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };
