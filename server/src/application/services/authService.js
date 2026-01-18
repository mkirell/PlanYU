import UserRepository from "../../infrastructure/repositories/userRepository.js";
import {
  ValidationError,
  NotFoundError,
  UnauthorizedError,
} from "../../shared/utils/errors.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import signTokens from "../../shared/utils/tokens.js";
import UserEntity from "../../domain/entities/userEntity.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";

const AuthService = {
  async register(payload) {
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid registration data",
        parsed.error.errors,
      );
    const entity = new UserEntity(parsed.data);
    if (entity.password !== undefined)
      entity.password_hash = await bcrypt.hash(entity.password, 10);
    return UserRepository.create(entity.toCreateObject());
  },

  async login(payload) {
    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid login data", parsed.error.errors);
    const entity = new UserEntity(parsed.data);
    const user = await UserRepository.findByEmail(entity.email);
    if (!user) throw new NotFoundError("User not found");
    const ok = await bcrypt.compare(entity.password, user.password_hash);
    if (!ok) throw new ValidationError("Invalid credentials");
    const tokens = signTokens(user);
    return { ...tokens, user };
  },

  async refresh(token) {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
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
