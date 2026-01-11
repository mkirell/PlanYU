import UserProjectRepository from "../repositories/userProjectRepository.js";
import UserRepository from "../repositories/userRepository.js";
import ProjectRepository from "../repositories/projectRepository.js";
import {
  createUserProjectSchema,
  updateUserProjectSchema,
} from "../validators/userProjectValidator.js";
import { ValidationError } from "../errors/index.js";

const UserProjectService = {
  async list() {
    return UserProjectRepository.findAll();
  },

  async get(user_id, project_id) {
    return UserProjectRepository.findByIds(user_id, project_id);
  },

  async create(payload) {
    const parsed = createUserProjectSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid user-project data",
        parsed.error.errors.map((e) => e.message)
      );
    }
    await UserRepository.findById(parsed.data.user_id);
    await ProjectRepository.findById(parsed.data.project_id);
    return UserProjectRepository.create(parsed.data);
  },

  async update(user_id, project_id, payload) {
    const parsed = updateUserProjectSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid user-project update data",
        parsed.error.errors.map((e) => e.message)
      );
    }
    return UserProjectRepository.update(user_id, project_id, parsed.data);
  },

  async delete(user_id, project_id) {
    return UserProjectRepository.delete(user_id, project_id);
  },
};

export default UserProjectService;
