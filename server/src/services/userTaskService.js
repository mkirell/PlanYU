import UserTaskRepository from "../repositories/userTaskRepository.js";
import UserRepository from "../repositories/userRepository.js";
import TaskRepository from "../repositories/taskRepository.js";
import UserProjectRepository from "../repositories/userProjectRepository.js";
import {
  createUserTaskSchema,
  updateUserTaskSchema,
} from "../validators/userTaskValidator.js";
import { ForbiddenError, ValidationError } from "../errors/errors.js";

const UserTaskService = {
  async list() {
    return UserTaskRepository.findAll();
  },

  async get(user_id, task_id) {
    return UserTaskRepository.findByIds(user_id, task_id);
  },

  async create(payload) {
    const parsed = createUserTaskSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid user-task data",
        parsed.error.errors.map((e) => e.message)
      );
    }
    const { user_id, task_id } = parsed.data;

    await UserRepository.findById(user_id);
    const task = await TaskRepository.findById(task_id);

    const membership = await UserProjectRepository.findByIds(
      user_id,
      task.project_id
    );
    if (!membership)
      throw new ForbiddenError("User does not belong to this project");

    if (parsed.data.role) {
      if (membership.role === "MEMBER")
        return UserTaskRepository.create(parsed.data);
      parsed.data.role = "REVIEWER";
      return UserTaskRepository.create(parsed.data);
    }
    parsed.data.role = membership.role === "MEMBER" ? "ASSIGNEE" : "REVIEWER";
    return UserTaskRepository.create(parsed.data);
  },

  async update(user_id, task_id, payload) {
    const parsed = updateUserTaskSchema.safeParse(payload);
    if (!parsed.success) {
      throw new ValidationError(
        "Invalid user-task update data",
        parsed.error.errors.map((e) => e.message)
      );
    }
    return UserTaskRepository.update(user_id, task_id, parsed.data);
  },

  async delete(user_id, task_id) {
    return UserTaskRepository.delete(user_id, task_id);
  },
};

export default UserTaskService;
