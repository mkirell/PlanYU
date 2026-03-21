import UserRoleService from "../../application/services/userRoleService.js";
import {
  AssignUserRoleDto,
  ReplaceUserRolesDto,
  UserRoleResponseDto,
} from "../dtos/userRoleDto.js";
import { ValidationError } from "../../shared/errors/appError.js";

export async function getUserRoles(req, res) {
  const userId = Number(req.params.user_id);
  if (!Number.isInteger(userId) || userId <= 0)
    throw new ValidationError("Invalid user ID");

  const rows = await UserRoleService.listByUserId(userId);
  res.status(200).json(rows.map((row) => new UserRoleResponseDto(row)));
}

export async function assignUserRole(req, res) {
  const userId = Number(req.params.user_id);
  if (!Number.isInteger(userId) || userId <= 0)
    throw new ValidationError("Invalid user ID");

  const dto = new AssignUserRoleDto(req.body);
  const roleId = Number(dto.role_id);
  if (!Number.isInteger(roleId) || roleId <= 0)
    throw new ValidationError("Invalid role ID");

  const rows = await UserRoleService.assignRoleByIdToUser(userId, roleId);
  res.status(201).json(rows.map((row) => new UserRoleResponseDto(row)));
}

export async function replaceUserRoles(req, res) {
  const userId = Number(req.params.user_id);
  if (!Number.isInteger(userId) || userId <= 0)
    throw new ValidationError("Invalid user ID");

  const dto = new ReplaceUserRolesDto(req.body);
  const roleIds = Array.isArray(dto.role_ids)
    ? dto.role_ids.map((id) => Number(id))
    : [];

  if (!Array.isArray(dto.role_ids) || roleIds.some((id) => !Number.isInteger(id) || id <= 0)) {
    throw new ValidationError("role_ids must be an array of positive integers");
  }

  const rows = await UserRoleService.replaceUserRolesById(userId, roleIds);
  res.status(200).json(rows.map((row) => new UserRoleResponseDto(row)));
}
