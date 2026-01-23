import { UserTask } from "../models/index.js";
import { NotFoundError } from "../../shared/utils/errorHandler.js";

const UserTaskRepository = {
  async findAll() {
    return UserTask.findAll({ order: [["user_id", "ASC"]] });
  },

  async findByIds(user_id, task_id) {
    const ut = await UserTask.findOne({ where: { user_id, task_id } });
    if (!ut) throw new NotFoundError("UserTask not found");
    return ut;
  },

  async create(data) {
    return UserTask.create(data);
  },

  async update(user_id, task_id, data) {
    const ut = await UserTask.findOne({ where: { user_id, task_id } });
    if (!ut) throw new NotFoundError("UserTask not found");
    await ut.update(data);
    return ut;
  },

  async delete(user_id, task_id) {
    const ut = await UserTask.findOne({ where: { user_id, task_id } });
    if (!ut) throw new NotFoundError("UserTask not found");
    const deletedUserTask = ut.toJSON();
    await ut.destroy();
    return deletedUserTask;
  },
};

export default UserTaskRepository;
