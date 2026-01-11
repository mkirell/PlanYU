import { UserProject } from "../models/index.js";
import { NotFoundError, ConflictError } from "../errors/index.js";

const UserProjectRepository = {
  async findAll() {
    return UserProject.findAll({ order: [["user_id", "ASC"]] });
  },

  async findByIds(user_id, project_id) {
    const up = await UserProject.findOne({ where: { user_id, project_id } });
    if (!up) throw new NotFoundError("UserProject not found");
    return up;
  },

  async create(data) {
    return UserProject.create(data);
  },

  async update(user_id, project_id, data) {
    const up = await UserProject.findOne({ where: { user_id, project_id } });
    if (!up) throw new NotFoundError("UserProject not found");
    await up.update(data);
    return up;
  },

  async delete(user_id, project_id) {
    const up = await UserProject.findOne({ where: { user_id, project_id } });
    if (!up) throw new NotFoundError("UserProject not found");
    const deletedUserProject = up.toJSON();
    await up.destroy();
    return deletedUserProject;
  },
};

export default UserProjectRepository;
