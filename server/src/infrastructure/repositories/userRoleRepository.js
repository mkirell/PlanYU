import { UserRole } from "../models/index.js";

const UserRoleRepository = {
  async findAllByUserId(user_id) {
    return UserRole.findAll({
      where: { user_id },
      order: [["role_id", "ASC"]],
    });
  },

  async findOne(user_id, role_id) {
    return UserRole.findOne({ where: { user_id, role_id } });
  },

  async create(data) {
    return UserRole.findOrCreate({
      where: { user_id: data.user_id, role_id: data.role_id },
    });
  },

  async bulkCreate(rows = []) {
    if (!rows.length) return [];
    return UserRole.bulkCreate(rows, { ignoreDuplicates: true });
  },

  async deleteAllByUserId(user_id) {
    return UserRole.destroy({ where: { user_id } });
  },
};

export default UserRoleRepository;
