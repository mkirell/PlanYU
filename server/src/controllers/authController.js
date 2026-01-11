import AuthService from "../services/authService.js";
import { AppError } from "../errors/index.js";

async function register(req, res) {
  try {
    const user = await AuthService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error registering user:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

async function login(req, res) {
  try {
    const result = await AuthService.login(req.body);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof AppError)
      return res
        .status(err.status)
        .json({ warning: err.message, details: err.details });
    console.error("Error logging in:", err);
    res.status(500).json({ error: "Internal server error" });
  }
}

export { register, login };
