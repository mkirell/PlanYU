import UserRepository from "../repositories/userRepository.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/userValidator.js";
import { ValidationError } from "../errors/index.js";
import bcrypt from "bcrypt";

const UserService = {
  async list() {
    return UserRepository.findAll();
  },

  async get(id) {
    return UserRepository.findById(id);
  },

  async create(payload) {
    const parsed = createUserSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid user data",
        parsed.error.errors.map((e) => e.message)
      );

    const { email, password } = parsed.data;
    const password_hash = await bcrypt.hash(password, 10);
    return UserRepository.create({ email, password_hash });
  },

  async update(id, payload) {
    const parsed = updateUserSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid update data",
        parsed.error.errors.map((e) => e.message)
      );

    const updateData = { ...parsed.data };
    if (updateData.password) {
      updateData.password_hash = await bcrypt.hash(updateData.password, 10);
      delete updateData.password;
    }
    return UserRepository.update(id, updateData);
  },

  async delete(id) {
    return UserRepository.delete(id);
  },
};

export default UserService;
