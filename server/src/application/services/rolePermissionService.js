import RolePermissionEntity from "../../domain/entities/rolePermissionEntity.js";
import RolePermissionRepository from "../../infrastructure/repositories/rolePermissionRepository.js";
import RoleRepository from "../../infrastructure/repositories/roleRepository.js";
import PermissionRepository from "../../infrastructure/repositories/permissionRepository.js";
import {
  assignRolePermissionValidator,
  replaceRolePermissionsValidator,
} from "../validators/rolePermissionValidator.js";
import { ValidationError } from "../../shared/errors/appError.js";

const RolePermissionService = {
  async listByRoleId(role_id) {
    return RolePermissionRepository.findAllByRoleId(role_id);
  },

  async listByRoleIds(roleIds = []) {
    return RolePermissionRepository.findAllByRoleIds(roleIds);
  },

  async assign(role_id, permission_id) {
    const entity = new RolePermissionEntity({ role_id, permission_id });
    return RolePermissionRepository.create(entity.toCreateObject());
  },

  async replaceForRole(role_id, permissionIds = []) {
    await RolePermissionRepository.deleteByRoleId(role_id);

    const rows = permissionIds.map((permission_id) => ({ role_id, permission_id }));
    if (rows.length > 0) {
      await RolePermissionRepository.bulkCreate(rows);
    }

    return RolePermissionRepository.findAllByRoleIds([role_id]);
  },

  async assignByIds(role_id, permission_id) {
    const parsed = assignRolePermissionValidator.safeParse({
      role_id,
      permission_id,
    });
    if (!parsed.success)
      throw new ValidationError(
        "Invalid role-permission data",
        parsed.error.errors,
      );

    await RoleRepository.findById(role_id);
    await PermissionRepository.findById(permission_id);
    const entity = new RolePermissionEntity(parsed.data);
    await RolePermissionRepository.create(entity.toCreateObject());
    return RolePermissionRepository.findAllByRoleId(role_id);
  },

  async replaceForRoleByIds(role_id, permissionIds = []) {
    const parsed = replaceRolePermissionsValidator.safeParse({
      role_id,
      permission_ids: permissionIds,
    });
    if (!parsed.success)
      throw new ValidationError(
        "Invalid role-permission data",
        parsed.error.errors,
      );

    await RoleRepository.findById(role_id);
    for (const permission_id of parsed.data.permission_ids) {
      await PermissionRepository.findById(permission_id);
    }

    await RolePermissionRepository.deleteByRoleId(role_id);

    const rows = parsed.data.permission_ids.map((permission_id) => ({
      role_id,
      permission_id,
    }));
    if (rows.length > 0) {
      await RolePermissionRepository.bulkCreate(rows);
    }

    return RolePermissionRepository.findAllByRoleId(role_id);
  },
};

export default RolePermissionService;
