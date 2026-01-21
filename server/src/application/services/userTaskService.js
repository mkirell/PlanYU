import UserTaskRepository from "../../infrastructure/repositories/userTaskRepository.js";
import UserRepository from "../../infrastructure/repositories/userRepository.js";
import TaskRepository from "../../infrastructure/repositories/taskRepository.js";
import UserProjectRepository from "../../infrastructure/repositories/userProjectRepository.js";
import { ForbiddenError, ValidationError } from "../../shared/utils/errors.js";
import UserTaskEntity from "../../domain/entities/userTaskEntity.js";
import {
  createUserTaskSchema,
  updateUserTaskSchema,
} from "../validators/userTaskValidator.js";

const UserTaskService = {
  async list() {
    return UserTaskRepository.findAll();
  },

  async get(user_id, task_id) {
    return UserTaskRepository.findByIds(user_id, task_id);
  },

  async create(payload) {
    const parsed = createUserTaskSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid user-task data", parsed.error.errors);
    const entity = new UserTaskEntity(parsed.data);
    const { user_id, task_id } = entity;

    await UserRepository.findById(user_id);
    const task = await TaskRepository.findById(task_id);

    const membership = await UserProjectRepository.findByIds(
      user_id,
      task.project_id,
    );
    if (!membership)
      throw new ForbiddenError("User does not belong to this project");

    if (membership.role === "OWNER")
      throw new ForbiddenError("Project owners cannot be assigned to tasks");

    const data = entity.toCreateObject();
    if (data.role) {
      if (membership.role === "MEMBER") return UserTaskRepository.create(data);
      data.role = "REVIEWER";
      return UserTaskRepository.create(data);
    }
    data.role = membership.role === "MEMBER" ? "ASSIGNEE" : "REVIEWER";
    return UserTaskRepository.create(data);
  },

  async update(user_id, task_id, payload) {
    const parsed = updateUserTaskSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid user-task data", parsed.error.errors);
    const entity = new UserTaskEntity(parsed.data);

    const task = await TaskRepository.findById(task_id);
    const membership = await UserProjectRepository.findByIds(
      user_id,
      task.project_id,
    ).catch(() => null);
    if (!membership)
      throw new ForbiddenError("User does not belong to this project");
    if (membership.role === "OWNER")
      throw new ForbiddenError("Project owners cannot be assigned to tasks");

    return UserTaskRepository.update(user_id, task_id, entity.toUpdateObject());
  },

  async delete(user_id, task_id) {
    return UserTaskRepository.delete(user_id, task_id);
  },
};

export default UserTaskService;
