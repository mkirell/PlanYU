import UserRepository from "../repositories/userRepository.js";
import { registerSchema, loginSchema } from "../validators/authValidator.js";
import { ValidationError, NotFoundError } from "../errors/index.js";
import bcrypt from "bcrypt";

const AuthService = {
  async register(payload) {
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid registration data",
        parsed.error.errors.map((e) => e.message)
      );

    const { email, password } = parsed.data;
    const password_hash = await bcrypt.hash(password, 10);

    return UserRepository.create({ email, password_hash });
  },

  async login(payload) {
    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid login data",
        parsed.error.errors.map((e) => e.message)
      );

    const { email, password } = parsed.data;
    const user = await UserRepository.findByEmail(email);
    if (!user) throw new NotFoundError("Invalid credentials");

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) throw new NotFoundError("Invalid credentials");

    return user;
  },
};

export default AuthService;
