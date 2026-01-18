import UserProjectRepository from "../../infrastructure/repositories/userProjectRepository.js";
import UserRepository from "../../infrastructure/repositories/userRepository.js";
import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";
import TaskRepository from "../../infrastructure/repositories/taskRepository.js";
import UserTaskRepository from "../../infrastructure/repositories/userTaskRepository.js";
import { ValidationError, NotFoundError } from "../../shared/utils/errors.js";
import UserProjectEntity from "../../domain/entities/userProjectEntity.js";
import {
  createUserProjectSchema,
  updateUserProjectSchema,
} from "../validators/userProjectValidator.js";

const UserProjectService = {
  async list() {
    return UserProjectRepository.findAll();
  },

  async get(user_id, project_id) {
    return UserProjectRepository.findByIds(user_id, project_id);
  },

  async create(payload) {
    const parsed = createUserProjectSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid user-project data",
        parsed.error.errors,
      );
    const entity = new UserProjectEntity(parsed.data);
    await UserRepository.findById(entity.user_id);
    await ProjectRepository.findById(entity.project_id);
    return UserProjectRepository.create(entity.toCreateObject());
  },

  async update(user_id, project_id, payload) {
    const parsed = updateUserProjectSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid user-project data",
        parsed.error.errors,
      );
    const entity = new UserProjectEntity(parsed.data);
    return UserProjectRepository.update(
      user_id,
      project_id,
      entity.toUpdateObject(),
    );
  },

  async delete(user_id, project_id) {
    const deleted = await UserProjectRepository.delete(user_id, project_id);
    const tasks = await TaskRepository.findAll();
    const projectTasks = tasks.filter(
      (t) => Number(t.project_id) === Number(project_id),
    );
    for (const t of projectTasks) {
      try {
        await UserTaskRepository.delete(Number(user_id), Number(t.task_id));
      } catch (err) {}
    }
    return deleted;
  },
};

export default UserProjectService;
