import RolePermissionService from "../../application/services/rolePermissionService.js";
import {
  AssignRolePermissionDto,
  ReplaceRolePermissionsDto,
  RolePermissionResponseDto,
} from "../dtos/rolePermissionDto.js";
import { ValidationError } from "../../shared/errors/appError.js";

export async function getRolePermissions(req, res) {
  const roleId = Number(req.params.role_id);
  if (!Number.isInteger(roleId) || roleId <= 0)
    throw new ValidationError("Invalid role ID");

  const rows = await RolePermissionService.listByRoleId(roleId);
  res.status(200).json(rows.map((row) => new RolePermissionResponseDto(row)));
}

export async function assignRolePermission(req, res) {
  const roleId = Number(req.params.role_id);
  if (!Number.isInteger(roleId) || roleId <= 0)
    throw new ValidationError("Invalid role ID");

  const dto = new AssignRolePermissionDto(req.body);
  const permissionId = Number(dto.permission_id);
  if (!Number.isInteger(permissionId) || permissionId <= 0)
    throw new ValidationError("Invalid permission ID");

  const rows = await RolePermissionService.assignByIds(roleId, permissionId);
  res.status(201).json(rows.map((row) => new RolePermissionResponseDto(row)));
}

export async function replaceRolePermissions(req, res) {
  const roleId = Number(req.params.role_id);
  if (!Number.isInteger(roleId) || roleId <= 0)
    throw new ValidationError("Invalid role ID");

  const dto = new ReplaceRolePermissionsDto(req.body);
  const permissionIds = Array.isArray(dto.permission_ids)
    ? dto.permission_ids.map((id) => Number(id))
    : [];

  if (
    !Array.isArray(dto.permission_ids) ||
    permissionIds.some((id) => !Number.isInteger(id) || id <= 0)
  ) {
    throw new ValidationError(
      "permission_ids must be an array of positive integers",
    );
  }

  const rows = await RolePermissionService.replaceForRoleByIds(
    roleId,
    permissionIds,
  );
  res.status(200).json(rows.map((row) => new RolePermissionResponseDto(row)));
}
