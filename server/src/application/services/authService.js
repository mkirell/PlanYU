import UserRepository from "../../infrastructure/repositories/userRepository.js";
import {
  ValidationError,
  NotFoundError,
} from "../../shared/utils/errors.js";
import bcrypt from "bcrypt";
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
    if (entity.password !== undefined) {
      entity.password_hash = await bcrypt.hash(entity.password, 10);
    }
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

    return user;
  },
};

export default AuthService;
