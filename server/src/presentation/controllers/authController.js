import AuthService from "../../application/services/authService.js";
import { RegisterDto, LoginDto } from "../dtos/authDto.js";

export async function register(req, res) {
  const dto = new RegisterDto(req.body);
  const user = await AuthService.register(dto);
  res.status(201).json(user);
}

export async function login(req, res) {
  const dto = new LoginDto(req.body);
  const result = await AuthService.login(dto);
  res.status(200).json(result);
}
