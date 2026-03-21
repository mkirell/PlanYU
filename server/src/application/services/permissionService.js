import PermissionEntity from "../../domain/entities/permissionEntity.js";
import PermissionRepository from "../../infrastructure/repositories/permissionRepository.js";
import RolePermissionRepository from "../../infrastructure/repositories/rolePermissionRepository.js";
import RoleService from "./roleService.js";
import {
  createPermissionValidator,
  updatePermissionValidator,
} from "../validators/permissionValidator.js";
import { ValidationError } from "../../shared/errors/appError.js";

const PermissionService = {
  async list() {
    return PermissionRepository.findAll();
  },

  async get(permission_id) {
    return PermissionRepository.findById(permission_id);
  },

  async listByUserId(user_id) {
    const roles = await RoleService.listByUserId(user_id);
    const roleIds = roles.map((role) => role.role_id);
    const rolePermissions =
      await RolePermissionRepository.findAllByRoleIds(roleIds);
    const permissionIds = [
      ...new Set(rolePermissions.map((row) => row.permission_id)),
    ];

    const permissions = await PermissionRepository.findByIds(permissionIds);
    return permissions.map((p) => `${p.resource}:${p.action}`.toLowerCase());
  },

  async create(payload) {
    const parsed = createPermissionValidator.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid permission data", parsed.error.errors);

    const entity = new PermissionEntity(parsed.data);
    return PermissionRepository.create(entity.toCreateObject());
  },

  async update(permission_id, payload) {
    const parsed = updatePermissionValidator.safeParse(payload);
    if (!parsed.success)
      throw new ValidationError("Invalid permission data", parsed.error.errors);

    const entity = new PermissionEntity(parsed.data);
    return PermissionRepository.update(permission_id, entity.toUpdateObject());
  },

  async delete(permission_id) {
    return PermissionRepository.delete(permission_id);
  },
};

export default PermissionService;
