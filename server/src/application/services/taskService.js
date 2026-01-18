import TaskRepository from "../../infrastructure/repositories/taskRepository.js";
import ProjectRepository from "../../infrastructure/repositories/projectRepository.js";
import TaskEntity from "../../domain/entities/taskEntity.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/taskValidator.js";
import { ValidationError } from "../../shared/utils/errors.js";

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

  async update(id, payload) {
    const parsed = updateTaskSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid task data", parsed.error.errors);
    const entity = new TaskEntity(parsed.data);
    return TaskRepository.update(id, entity.toUpdateObject());
  },

  async delete(id) {
    return TaskRepository.delete(id);
  },
};

export default TaskService;
