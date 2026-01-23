import TaskRepository from "../../infrastructure/repositories/taskRepository.js";
import UserTaskRepository from "../../infrastructure/repositories/userTaskRepository.js";
import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";
import UserProjectRepository from "../../infrastructure/repositories/userProjectRepository.js";
import TaskEntity from "../../domain/entities/taskEntity.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/taskValidator.js";
import {
  ValidationError,
  UnauthorizedError,
} from "../../shared/utils/errorHandler.js";

const TaskService = {
  async list() {
    return TaskRepository.findAll();
  },

  async get(id) {
    return TaskRepository.findById(id);
  },

  async create(payload) {
    const parsed = createTaskSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid task data", parsed.error.errors);
    const entity = new TaskEntity(parsed.data);
    await ProjectRepository.findById(entity.project_id);
    return TaskRepository.create(entity.toCreateObject());
  },

  async update(id, payload, user) {
    const parsed = updateTaskSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid task data", parsed.error.errors);
    const entity = new TaskEntity(parsed.data);

    const ut = await UserTaskRepository.findByIds(user.user_id, id).catch(
      () => null,
    );

    let effectiveRole = null;
    if (ut) {
      effectiveRole = ut.role;
    } else {
      const taskRecord = await TaskRepository.findById(id).catch(() => null);
      if (taskRecord && taskRecord.project_id) {
        const up = await UserProjectRepository.findByIds(
          user.user_id,
          taskRecord.project_id,
        ).catch(() => null);
        if (up) effectiveRole = up.role;
      }
    }

    if (effectiveRole) {
      if (effectiveRole === "ASSIGNEE") {
        const allowed = ["TODO", "DOING", "REVIEW"];
        if (!allowed.includes(entity.status))
          throw new UnauthorizedError("Action not allowed");
      } else if (!["REVIEWER", "OWNER"].includes(effectiveRole)) {
        throw new UnauthorizedError("Insufficient permissions");
      }
    }

    return TaskRepository.update(id, entity.toUpdateObject());
  },

  async delete(id) {
    return TaskRepository.delete(id);
  },
};

export default TaskService;
