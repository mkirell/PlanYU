import UserRepository from "../../infrastructure/repositories/userRepository.js";
import AuthRepository from "../../infrastructure/repositories/authRepository.js";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/errors/appError.js";
import bcrypt from "bcrypt";
import UserEntity from "../../domain/entities/userEntity.js";
import { EmailVO } from "../../domain/values/emailValue.js";
import { PasswordVO } from "../../domain/values/passwordValue.js";
import {
  sendEmailSafe,
  sendVerificationCodeEmail,
  sendLoginCodeEmail,
} from "../../infrastructure/notifications/emailService.js";
import {
  createOtpToken,
  createTrustToken,
  createRefreshSession,
  hashToken,
  signAccessToken,
  rotateRefreshSession,
  revokeRefreshSession,
} from "../security/tokenSecurityService.js";
import {
  registerValidator,
  loginValidator,
  verifyCodeValidator,
  resendCodeValidator,
} from "../validators/authValidator.js";
import UserRoleService from "./userRoleService.js";

const issueSessionTokens = async (user, metadata = null) => {
  const accessToken = signAccessToken(user);
  const { refreshToken } = await createRefreshSession(user.user_id, metadata);
  return { accessToken, refreshToken };
};

const AuthService = {
  async register(payload) {
    const parsed = registerValidator.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid registration data",
        parsed.error.errors,
      );
    const emailVO = new EmailVO(parsed.data.email);
    const passwordVO = new PasswordVO(parsed.data.password);
    const emailValue = emailVO.getValue();
    const passwordValue = passwordVO.getValue();

    const entity = new UserEntity({
      ...parsed.data,
      email: emailValue,
      verified_at: null,
    });
    if (passwordValue !== undefined)
      entity.password_hash = await bcrypt.hash(passwordValue, 10);
    const user = await UserRepository.create(entity.toCreateObject());
    await UserRoleService.ensureAtLeastOneRole(user.user_id, user.role || "GUEST");

    const { code } = await createOtpToken(user.user_id, "EMAIL_VERIFY");
    const emailSent = await sendEmailSafe(
      sendVerificationCodeEmail,
      user.email,
      code,
    );
    return { user, emailSent };
  },

  async login(payload, { trustToken, ip, userAgent } = {}) {
    const parsed = loginValidator.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid login data", parsed.error.errors);
    const emailVO = new EmailVO(parsed.data.email);
    const passwordVO = new PasswordVO(parsed.data.password);
    const emailValue = emailVO.getValue();
    const passwordValue = passwordVO.getValue();
    const user = await UserRepository.findByEmail(emailValue);
    if (!user) throw new UnauthorizedError("Invalid credentials");
    if (!user.verified_at) throw new UnauthorizedError("Email not verified");
    const ok = await bcrypt.compare(passwordValue, user.password_hash);
    if (!ok) throw new UnauthorizedError("Invalid credentials");

    if (trustToken) {
      const trustHash = hashToken(trustToken);
      const trusted = await AuthRepository.findByTokenHash(
        trustHash,
        "TRUST_DEVICE",
      );
      if (trusted && !trusted.used_at) {
        const expiresAt = new Date(trusted.expires_at);
        if (trusted.user_id === user.user_id && expiresAt > new Date()) {
          const tokens = await issueSessionTokens(user, { ip, userAgent });
          return { ...tokens, user, trustedDevice: true };
        }
      }
    }

    const { code, token_id } = await createOtpToken(user.user_id, "LOGIN_2FA", {
      ip,
      userAgent,
    });

    const emailSent = await sendEmailSafe(sendLoginCodeEmail, user.email, code);

    return { requiresTwoFactor: true, challengeId: token_id, emailSent };
  },

  async refresh(token, { ip, userAgent } = {}) {
    const rotated = await rotateRefreshSession(token, { ip, userAgent });
    if (!rotated) {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const user = await UserRepository.findById(rotated.user_id);
    if (!user) throw new NotFoundError("User not found");
    if (!user.verified_at) throw new UnauthorizedError("Email not verified");

    const accessToken = signAccessToken(user);
    return { accessToken, refreshToken: rotated.refreshToken, user };
  },

  async revoke(token) {
    return revokeRefreshSession(token);
  },

  async verifyCode(payload) {
    const parsed = verifyCodeValidator.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid verification code",
        parsed.error.errors,
      );

    if (parsed.data.purpose === "register") {
      const user = await UserRepository.findByEmail(parsed.data.email);
      if (!user)
        throw new ValidationError("Invalid or expired verification code");

      const token = await AuthRepository.findLatestActiveByUserAndType(
        user.user_id,
        "EMAIL_VERIFY",
      );
      if (!token)
        throw new ValidationError("Invalid or expired verification code");

      const expiresAt = new Date(token.expires_at);
      if (expiresAt < new Date())
        throw new ValidationError("Verification code expired");

      const tokenHash = hashToken(parsed.data.code);
      if (tokenHash !== token.token_hash)
        throw new ValidationError("Invalid or expired verification code");

      await AuthRepository.markUsed(token.auth_id);
      if (!user.verified_at) {
        await UserRepository.update(user.user_id, {
          verified_at: new Date(),
        });
      }
      const verifiedUser = await UserRepository.findById(user.user_id);

      const trustToken = parsed.data.rememberDevice
        ? await createTrustToken(verifiedUser.user_id)
        : null;

      const tokens = await issueSessionTokens(verifiedUser);
      return { purpose: "register", ...tokens, user: verifiedUser, trustToken };
    }

    const token = await AuthRepository.findByTokenId(
      parsed.data.challengeId,
    );
    if (!token || token.type !== "LOGIN_2FA" || token.used_at)
      throw new UnauthorizedError("Invalid or expired login code");

    const expiresAt = new Date(token.expires_at);
    if (expiresAt < new Date())
      throw new UnauthorizedError("Login code expired");

    const tokenHash = hashToken(parsed.data.code);
    if (tokenHash !== token.token_hash)
      throw new UnauthorizedError("Invalid or expired login code");

    await AuthRepository.markUsed(token.auth_id);

    const user = await UserRepository.findById(token.user_id);
    if (!user.verified_at) throw new UnauthorizedError("Email not verified");

    const trustToken = parsed.data.rememberDevice
      ? await createTrustToken(user.user_id)
      : null;

    const tokens = await issueSessionTokens(user);
    return { purpose: "login", ...tokens, user, trustToken };
  },

  async resendCode(payload) {
    const parsed = resendCodeValidator.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid resend request", parsed.error.errors);

    if (parsed.data.purpose === "register") {
      const user = await UserRepository.findByEmail(parsed.data.email);
      if (!user || user.verified_at) return { emailSent: true };

      const { code } = await createOtpToken(user.user_id, "EMAIL_VERIFY");
      const emailSent = await sendEmailSafe(
        sendVerificationCodeEmail,
        user.email,
        code,
      );

      return { emailSent };
    }

    const token = await AuthRepository.findByTokenId(
      parsed.data.challengeId,
    );
    if (!token || token.type !== "LOGIN_2FA" || token.used_at)
      throw new UnauthorizedError("Invalid login challenge");

    await AuthRepository.markUsed(token.auth_id);

    const user = await UserRepository.findById(token.user_id);
    if (!user.verified_at) throw new UnauthorizedError("Email not verified");

    const { code, token_id } = await createOtpToken(user.user_id, "LOGIN_2FA");
    const emailSent = await sendEmailSafe(sendLoginCodeEmail, user.email, code);

    return { emailSent, challengeId: token_id };
  },

  async revokeTrustedDevice(token) {
    if (!token) return false;
    const tokenHash = hashToken(token);
    await AuthRepository.revokeByTokenHash(tokenHash, "TRUST_DEVICE");
    return true;
  },
};

export default AuthService;
