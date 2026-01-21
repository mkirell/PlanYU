import UserRepository from "../../infrastructure/repositories/userRepository.js";
import UserProjectRepository from "../../infrastructure/repositories/userProjectRepository.js";
import bcrypt from "bcrypt";
import UserEntity from "../../domain/entities/userEntity.js";
import {
  createUserSchema,
  updateUserSchema,
} from "../validators/userValidator.js";
import { ValidationError } from "../../shared/utils/errors.js";
import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";

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
      throw new ValidationError("Invalid user data", parsed.error.errors);
    const entity = new UserEntity(parsed.data);
    if (entity.role === "ADMIN")
      throw new ValidationError("Cannot assign ADMIN role");
    if (entity.password !== undefined) {
      entity.password_hash = await bcrypt.hash(entity.password, 10);
    }
    return UserRepository.create(entity.toCreateObject());
  },

  async update(id, payload) {
    const parsed = updateUserSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid user data", parsed.error.errors);
    const entity = new UserEntity(parsed.data);
    if (entity.role === "ADMIN")
      throw new ValidationError("Cannot assign ADMIN role");
    if (entity.password !== undefined) {
      entity.password_hash = await bcrypt.hash(entity.password, 10);
    }
    return UserRepository.update(id, entity.toUpdateObject());
  },

  async delete(id) {
    const projects = await UserProjectRepository.findByOwnerId(id);
    const projectIds = projects.map((r) => r.project_id);
    if (projectIds && projectIds.length > 0) {
      for (const pid of projectIds) {
        await ProjectRepository.delete(pid);
      }
    }
    return UserRepository.delete(id);
  },
};

export default UserService;
