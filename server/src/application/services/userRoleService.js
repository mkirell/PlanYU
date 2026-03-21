import UserRoleEntity from "../../domain/entities/userRoleEntity.js";
import UserRoleRepository from "../../infrastructure/repositories/userRoleRepository.js";
import RoleService from "./roleService.js";
import RoleRepository from "../../infrastructure/repositories/roleRepository.js";
import {
  assignUserRoleValidator,
  replaceUserRolesValidator,
} from "../validators/userRoleValidator.js";
import { ValidationError } from "../../shared/errors/appError.js";

const normalizeRoleName = (roleName) => String(roleName || "").trim().toUpperCase();

const UserRoleService = {
  async listByUserId(user_id) {
    return UserRoleRepository.findAllByUserId(user_id);
  },

  async assignRoleByNameToUser(user_id, roleName) {
    const role = await RoleService.getByName(normalizeRoleName(roleName));
    if (!role) return null;

    const entity = new UserRoleEntity({ user_id, role_id: role.role_id });
    await UserRoleRepository.create(entity.toCreateObject());

    return role;
  },

  async assignRoleByIdToUser(user_id, role_id) {
    const parsed = assignUserRoleValidator.safeParse({ user_id, role_id });
    if (!parsed.success)
      throw new ValidationError("Invalid user-role data", parsed.error.errors);

    await RoleRepository.findById(role_id);
    const entity = new UserRoleEntity(parsed.data);
    await UserRoleRepository.create(entity.toCreateObject());
    return UserRoleRepository.findAllByUserId(user_id);
  },

  async ensureAtLeastOneRole(user_id, fallbackRole = "GUEST") {
    const existing = await UserRoleRepository.findAllByUserId(user_id);
    if (existing.length > 0) return existing;

    await this.assignRoleByNameToUser(user_id, fallbackRole);
    return UserRoleRepository.findAllByUserId(user_id);
  },

  async replaceUserRolesByName(user_id, roleNames = []) {
    await UserRoleRepository.deleteAllByUserId(user_id);
    const rows = [];

    for (const roleName of roleNames) {
      const role = await RoleService.getByName(normalizeRoleName(roleName));
      if (role) {
        rows.push({ user_id, role_id: role.role_id });
      }
    }

    if (rows.length > 0) {
      await UserRoleRepository.bulkCreate(rows);
    }

    return UserRoleRepository.findAllByUserId(user_id);
  },

  async replaceUserRolesById(user_id, roleIds = []) {
    const parsed = replaceUserRolesValidator.safeParse({
      user_id,
      role_ids: roleIds,
    });
    if (!parsed.success)
      throw new ValidationError("Invalid user-role data", parsed.error.errors);

    await UserRoleRepository.deleteAllByUserId(user_id);

    const rows = [];
    for (const role_id of parsed.data.role_ids) {
      await RoleRepository.findById(role_id);
      rows.push({ user_id, role_id });
    }

    if (rows.length > 0) {
      await UserRoleRepository.bulkCreate(rows);
    }

    return UserRoleRepository.findAllByUserId(user_id);
  },
};

export default UserRoleService;
