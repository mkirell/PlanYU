import AuthService from "../services/authService.js";

export async function register(req, res) {
  const user = await AuthService.register(req.body);
  res.status(201).json(user);
}

export async function login(req, res) {
  const result = await AuthService.login(req.body);
  res.status(200).json(result);
}
