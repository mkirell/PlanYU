import { Op } from "sequelize";
import { RolePermission } from "../models/index.js";

const RolePermissionRepository = {
  async findAllByRoleId(role_id) {
    return RolePermission.findAll({
      where: { role_id },
      order: [["permission_id", "ASC"]],
    });
  },

  async findAllByRoleIds(roleIds = []) {
    if (!roleIds.length) return [];
    return RolePermission.findAll({
      where: { role_id: { [Op.in]: roleIds } },
      order: [["role_id", "ASC"], ["permission_id", "ASC"]],
    });
  },

  async create(data) {
    return RolePermission.findOrCreate({
      where: { role_id: data.role_id, permission_id: data.permission_id },
    });
  },

  async bulkCreate(rows = []) {
    if (!rows.length) return [];
    return RolePermission.bulkCreate(rows, { ignoreDuplicates: true });
  },

  async deleteByRoleId(role_id) {
    return RolePermission.destroy({ where: { role_id } });
  },
};

export default RolePermissionRepository;
