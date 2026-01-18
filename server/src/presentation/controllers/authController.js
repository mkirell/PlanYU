import AuthService from "../../application/services/authService.js";
import { AuthRequestDto, AuthResponseDto } from "../dtos/authDto.js";

export async function register(req, res) {
  const dto = new AuthRequestDto(req.body);
  const user = await AuthService.register(dto);
  res.status(201).json(new AuthResponseDto(user));
}

export async function login(req, res) {
  const dto = new AuthRequestDto(req.body);
  const result = await AuthService.login(dto, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  res.cookie("session", result.refreshToken, cookieOptions);
  res.status(200).json({
    accessToken: result.accessToken,
    user: new AuthResponseDto(result.user),
  });
}

export async function refresh(req, res) {
  const plain = req.cookies?.session;
  if (!plain) return res.status(401).json({ message: "No refresh token" });
  const result = await AuthService.refresh(plain, {
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  };
  res.cookie("session", result.refreshToken, cookieOptions);
  res.status(200).json({
    accessToken: result.accessToken,
    user: new AuthResponseDto(result.user),
  });
}

export async function logout(req, res) {
  const plain = req.cookies?.session;
  if (plain) await AuthService.revoke(plain);
  res.clearCookie("session", { path: "/api/auth" });
  res.status(204).send();
}
