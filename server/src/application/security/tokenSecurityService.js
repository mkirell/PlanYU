import crypto from "crypto";
import jwt from "jsonwebtoken";
import AuthRepository from "../../infrastructure/repositories/authRepository.js";

const ACCESS_TTL = "15m"; // 15 minutes
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const TRUST_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const hashToken = (token) =>
  crypto.createHash("sha256").update(token).digest("hex");

const generateTokenId = () => crypto.randomBytes(16).toString("hex");

const generateOpaqueToken = (byteLength = 48) =>
  crypto.randomBytes(byteLength).toString("hex");

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

const generateExpiringOpaqueToken = (expiresInMs = TRUST_TTL_MS) => {
  const token = generateOpaqueToken(32);
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + expiresInMs);
  return { token, tokenHash, expiresAt };
};

const signAccessToken = (user) => {
  const tokenVersion = user.token_version ?? 0;
  const subject = String(user.user_id ?? user.id ?? "");
  return jwt.sign(
    { email: user.email, tokenVersion, role: user.role ?? "GUEST" },
    process.env.JWT_ACCESS_SECRET,
    { subject, expiresIn: ACCESS_TTL },
  );
};

const verifyAccessToken = (token) => {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
};

const createOtpToken = async (user_id, type, metadata = null) => {
  const { code, tokenHash, expiresAt } = generateOtpToken(OTP_TTL_MS, 6);
  const token_id = generateTokenId();
  await AuthRepository.create({
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
  const trust = generateExpiringOpaqueToken(TRUST_TTL_MS);
  await AuthRepository.create({
    token_id: generateTokenId(),
    user_id,
    type: "TRUST_DEVICE",
    token_hash: trust.tokenHash,
    expires_at: trust.expiresAt,
  });
  return trust.token;
};

const createRefreshSession = async (user_id, metadata = null) => {
  const refreshToken = generateOpaqueToken(48);
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

  await AuthRepository.create({
    token_id: generateTokenId(),
    user_id,
    type: "REFRESH_SESSION",
    token_hash: tokenHash,
    expires_at: expiresAt,
    metadata,
  });

  return { refreshToken, expiresAt };
};

const rotateRefreshSession = async (refreshToken, metadata = null) => {
  const tokenHash = hashToken(refreshToken);
  const stored = await AuthRepository.findByTokenHash(
    tokenHash,
    "REFRESH_SESSION",
  );

  if (!stored) return null;

  const expiresAt = new Date(stored.expires_at);
  if (stored.used_at || expiresAt < new Date()) {
    if (stored.used_at) {
      await AuthRepository.revokeAllActiveByUserAndType(
        stored.user_id,
        "REFRESH_SESSION",
      );
    }
    return null;
  }

  await AuthRepository.markUsed(stored.auth_id);
  const next = await createRefreshSession(stored.user_id, {
    rotatedFrom: stored.token_id,
    ...(metadata || {}),
  });

  return { user_id: stored.user_id, refreshToken: next.refreshToken };
};

const revokeRefreshSession = async (refreshToken) => {
  if (!refreshToken) return false;
  const tokenHash = hashToken(refreshToken);
  const revoked = await AuthRepository.revokeByTokenHash(
    tokenHash,
    "REFRESH_SESSION",
  );
  return Boolean(revoked);
};

export {
  hashToken,
  generateTokenId,
  generateOtpCode,
  generateOtpToken,
  generateOpaqueToken,
  signAccessToken,
  verifyAccessToken,
  createOtpToken,
  createTrustToken,
  createRefreshSession,
  rotateRefreshSession,
  revokeRefreshSession,
};
