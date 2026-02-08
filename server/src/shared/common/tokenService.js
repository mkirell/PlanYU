import crypto from "crypto";
import jwt from "jsonwebtoken";
import AuthTokenRepository from "../../infrastructure/repositories/authTokenRepository.js";

const ACCESS_TTL = "15m"; // 15 minutes
const REFRESH_TTL = "7d"; // 7 days
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const TRUST_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const generateTokenId = () => crypto.randomBytes(16).toString("hex");

const generateOtpCode = (length = 6) => {
  let code = "";
  for (let i = 0; i < length; i += 1) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
};

const generateOtpToken = (expiresInMs = OTP_TTL_MS, length = 6) => {
  const code = generateOtpCode(length);
  const tokenHash = hashToken(code);
  const expiresAt = new Date(Date.now() + expiresInMs);
  return { code, tokenHash, expiresAt };
};

const generateOpaqueToken = (expiresInMs = TRUST_TTL_MS) => {
  const token = crypto.randomBytes(32).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + expiresInMs);
  return { token, tokenHash, expiresAt };
};

const signTokens = (user) => {
  const tokenVersion = user.token_version ?? 0;
  const subject = String(user.user_id ?? user.id ?? "");
  const accessToken = jwt.sign(
    { email: user.email, tokenVersion, role: user.role ?? "GUEST" },
    process.env.JWT_ACCESS_SECRET,
    { subject, expiresIn: ACCESS_TTL },
  );
  const refreshToken = jwt.sign(
    { email: user.email, tokenVersion, role: user.role ?? "GUEST" },
    process.env.JWT_REFRESH_SECRET,
    { subject, expiresIn: REFRESH_TTL },
  );
  return { accessToken, refreshToken };
};

const createOtpToken = async (user_id, type, metadata = null) => {
  const { code, tokenHash, expiresAt } = generateOtpToken(OTP_TTL_MS, 6);
  const token_id = generateTokenId();
  await AuthTokenRepository.create({
    token_id,
    user_id,
    type,
    token_hash: tokenHash,
    expires_at: expiresAt,
    metadata,
  });
  return { code, token_id };
};

const createTrustToken = async (user_id) => {
  const trust = generateOpaqueToken(TRUST_TTL_MS);
  await AuthTokenRepository.create({
    token_id: generateTokenId(),
    user_id,
    type: "TRUST_DEVICE",
    token_hash: trust.tokenHash,
    expires_at: trust.expiresAt,
  });
  return trust.token;
};

export {
  hashToken,
  generateTokenId,
  generateOtpCode,
  generateOtpToken,
  generateOpaqueToken,
  signTokens,
  createOtpToken,
  createTrustToken,
};
