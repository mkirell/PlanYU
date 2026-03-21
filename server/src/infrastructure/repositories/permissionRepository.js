import { Op } from "sequelize";
import { Permission } from "../models/index.js";
import { NotFoundError } from "../../shared/errors/appError.js";

const PermissionRepository = {
  async findAll() {
    return Permission.findAll({ order: [["resource", "ASC"], ["action", "ASC"]] });
  },

  async findById(permission_id) {
    const permission = await Permission.findByPk(permission_id);
    if (!permission) throw new NotFoundError("Permission not found");
    return permission;
  },

  async findByResourceAction(resource, action) {
    return Permission.findOne({ where: { resource, action } });
  },

  async findByIds(permissionIds = []) {
    if (!permissionIds.length) return [];
    return Permission.findAll({
      where: { permission_id: { [Op.in]: permissionIds } },
      order: [["resource", "ASC"], ["action", "ASC"]],
    });
  },

  async create(data) {
    return Permission.create(data);
  },

  async update(permission_id, data) {
    const permission = await this.findById(permission_id);
    await permission.update(data);
    return permission;
  },

  async delete(permission_id) {
    const permission = await this.findById(permission_id);
    const snapshot = permission.toJSON();
    await permission.destroy();
    return snapshot;
  },
};

export default PermissionRepository;
