import AuthService from "../../application/services/authService.js";
import { AuthRequestDto, AuthResponseDto } from "../dtos/authDto.js";

const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const TRUST_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "Strict",
  path: "/api/auth",
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

const setSessionCookie = (res, refreshToken) => {
  res.cookie("session", refreshToken, SESSION_COOKIE_OPTIONS);
};

const setTrustCookie = (res, trustToken) => {
  if (trustToken) res.cookie("trust", trustToken, TRUST_COOKIE_OPTIONS);
};

export async function register(req, res) {
  const dto = new AuthRequestDto(req.body);
  const result = await AuthService.register(dto);
  res.status(201).json({
    message:
      "Registration successful. Check your email to verify your account.",
    emailSent: result.emailSent,
    user: new AuthResponseDto(result.user),
  });
}

export async function login(req, res) {
  const dto = new AuthRequestDto(req.body);
  const result = await AuthService.login(dto, {
    trustToken: req.cookies?.trust,
    ip: req.ip,
    userAgent: req.get("user-agent"),
  });
  if (result.requiresTwoFactor) {
    return res.status(200).json({
      requiresTwoFactor: true,
      challengeId: result.challengeId,
      emailSent: result.emailSent,
    });
  }
  setSessionCookie(res, result.refreshToken);
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
  setSessionCookie(res, result.refreshToken);
  res.status(200).json({
    accessToken: result.accessToken,
    user: new AuthResponseDto(result.user),
  });
}

export async function verifyCode(req, res) {
  const result = await AuthService.verifyCode(req.body);
  if (result.purpose === "register") {
    setSessionCookie(res, result.refreshToken);
    setTrustCookie(res, result.trustToken);
    return res.status(200).json({
      message: "Email verified successfully.",
      accessToken: result.accessToken,
      user: new AuthResponseDto(result.user),
    });
  }

  setSessionCookie(res, result.refreshToken);
  setTrustCookie(res, result.trustToken);
  return res.status(200).json({
    accessToken: result.accessToken,
    user: new AuthResponseDto(result.user),
  });
}

export async function resendCode(req, res) {
  const result = await AuthService.resendCode(req.body);
  res.status(200).json({
    message: "If the request is valid, a code has been sent.",
    emailSent: result.emailSent,
    challengeId: result.challengeId,
  });
}

export async function logout(req, res) {
  const plain = req.cookies?.session;
  if (plain) await AuthService.revoke(plain);
  await AuthService.revokeTrustedDevice(req.cookies?.trust);
  res.clearCookie("session", { path: "/api/auth" });
  res.clearCookie("trust", { path: "/api/auth" });
  res.status(204).send();
}
