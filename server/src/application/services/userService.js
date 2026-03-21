import UserRepository from "../../infrastructure/repositories/userRepository.js";
import UserProjectRepository from "../../infrastructure/repositories/userProjectRepository.js";
import bcrypt from "bcrypt";
import UserEntity from "../../domain/entities/userEntity.js";
import { EmailVO } from "../../domain/values/emailValue.js";
import { PasswordVO } from "../../domain/values/passwordValue.js";
import {
  createUserValidator,
  updateUserValidator,
} from "../validators/userValidator.js";
import { ValidationError } from "../../shared/errors/appError.js";
import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";
import UserRoleService from "./userRoleService.js";

const UserService = {
  async list() {
    return UserRepository.findAll();
  },

  async get(id) {
    return UserRepository.findById(id);
  },

  async create(payload) {
    const parsed = createUserValidator.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid user data", parsed.error.errors);
    const emailVO = new EmailVO(parsed.data.email);
    const passwordVO = new PasswordVO(parsed.data.password);
    const emailValue = emailVO.getValue();
    const passwordValue = passwordVO.getValue();
    const entity = new UserEntity({ ...parsed.data, email: emailValue });
    if (entity.role === "ADMIN")
      throw new ValidationError("Cannot assign ADMIN role");
    if (passwordValue !== undefined) {
      entity.password_hash = await bcrypt.hash(passwordValue, 10);
    }
    const created = await UserRepository.create(entity.toCreateObject());
    await UserRoleService.ensureAtLeastOneRole(
      created.user_id,
      created.role || "GUEST",
    );
    return created;
  },

  async update(id, payload) {
    const parsed = updateUserValidator.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid user data", parsed.error.errors);
    const emailVO = new EmailVO(parsed.data.email);
    const passwordVO = new PasswordVO(parsed.data.password);
    const emailValue = emailVO.getValue();
    const passwordValue = passwordVO.getValue();
    const entity = new UserEntity({ ...parsed.data, email: emailValue });
    if (entity.role === "ADMIN")
      throw new ValidationError("Cannot assign ADMIN role");
    if (passwordValue !== undefined) {
      entity.password_hash = await bcrypt.hash(passwordValue, 10);
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
