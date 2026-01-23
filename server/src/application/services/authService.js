import UserRepository from "../../infrastructure/repositories/userRepository.js";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/utils/errorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import signTokens from "../../shared/config/sessionStore.js";
import UserEntity from "../../domain/entities/userEntity.js";
import { EmailVO } from "../../domain/values/emailValue.js";
import { PasswordVO } from "../../domain/values/passwordValue.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

const AuthService = {
  async register(payload) {
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid registration data",
        parsed.error.errors,
      );
    const emailVO = new EmailVO(parsed.data.email);
    const passwordVO = new PasswordVO(parsed.data.password);
    const emailValue = emailVO.getValue();
    const passwordValue = passwordVO.getValue();
    const entity = new UserEntity({ ...parsed.data, email: emailValue });
    if (passwordValue !== undefined)
      entity.password_hash = await bcrypt.hash(passwordValue, 10);
    return UserRepository.create(entity.toCreateObject());
  },

  async login(payload) {
    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid login data", parsed.error.errors);
    const emailVO = new EmailVO(parsed.data.email);
    const passwordVO = new PasswordVO(parsed.data.password);
    const emailValue = emailVO.getValue();
    const passwordValue = passwordVO.getValue();
    const user = await UserRepository.findByEmail(emailValue);
    if (!user) throw new NotFoundError("User not found");
    const ok = await bcrypt.compare(passwordValue, user.password_hash);
    if (!ok) throw new ValidationError("Invalid credentials");
    const tokens = signTokens(user);
    return { ...tokens, user };
  },

  async refresh(token) {
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new UnauthorizedError("Invalid refresh token");
    }
    const user = await UserRepository.findById(payload.sub);
    if (!user) throw new NotFoundError("User not found");
    const tokenVersion = payload.tokenVersion ?? null;
    if (tokenVersion === null || tokenVersion !== (user.token_version ?? 0))
      throw new UnauthorizedError("Refresh token revoked");
    const tokens = signTokens(user);
    return { ...tokens, user };
  },

  async revoke(token) {
    const payload = jwt.decode(token) || {};
    const userId = payload.sub;
    if (!userId) return false;
    const user = await UserRepository.findById(userId);
    const newVersion = (user.token_version ?? 0) + 1;
    await UserRepository.update(userId, { token_version: newVersion });
    return true;
  },
};

export default AuthService;
