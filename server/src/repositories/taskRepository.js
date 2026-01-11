import { Task } from "../models/index.js";
import { NotFoundError } from "../errors/errors.js";

const TaskRepository = {
  async findAll() {
    return Task.findAll({ order: [["task_id", "ASC"]] });
  },

  async findById(id) {
    const t = await Task.findByPk(id);
    if (!t) throw new NotFoundError("Task not found");
    return t;
  },

  async create(data) {
    return Task.create(data);
  },

  async update(id, data) {
    const task = await Task.findByPk(id);
    if (!task) throw new NotFoundError("Task not found");
    await task.update(data);
    return task;
  },

  async delete(id) {
    const task = await Task.findByPk(id);
    if (!task) throw new NotFoundError("Task not found");
    const deletedTask = task.toJSON();
    await task.destroy();
    return deletedTask;
  },
};

export default TaskRepository;
