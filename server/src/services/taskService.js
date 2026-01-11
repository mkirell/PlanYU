import TaskRepository from "../repositories/taskRepository.js";
import ProjectRepository from "../repositories/projectRepository.js";
import {
  createTaskSchema,
  updateTaskSchema,
} from "../validators/taskValidator.js";
import { ValidationError } from "../errors/index.js";

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
      throw new ValidationError(
        "Invalid task data",
        parsed.error.errors.map((e) => e.message)
      );

    await ProjectRepository.findById(parsed.data.project_id);
    return TaskRepository.create(parsed.data);
  },

  async update(id, payload) {
    const parsed = updateTaskSchema.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError(
        "Invalid update data",
        parsed.error.errors.map((e) => e.message)
      );
    return TaskRepository.update(id, parsed.data);
  },

  async delete(id) {
    return TaskRepository.delete(id);
  },
};

export default TaskService;
