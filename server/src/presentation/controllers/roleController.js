import RoleService from "../../application/services/roleService.js";
import {
  CreateRoleDto,
  UpdateRoleDto,
  RoleResponseDto,
} from "../dtos/roleDto.js";
import { ValidationError } from "../../shared/errors/appError.js";

export async function getAllRoles(req, res) {
  const roles = await RoleService.list();
  res.status(200).json(roles.map((role) => new RoleResponseDto(role)));
}

export async function getRoleById(req, res) {
  const roleId = Number(req.params.role_id);
  if (!Number.isInteger(roleId) || roleId <= 0)
    throw new ValidationError("Invalid role ID");

  const role = await RoleService.get(roleId);
  res.status(200).json(new RoleResponseDto(role));
}

export async function createRole(req, res) {
  const dto = new CreateRoleDto(req.body);
  const created = await RoleService.create(dto);
  res.status(201).json(new RoleResponseDto(created));
}

export async function updateRole(req, res) {
  const roleId = Number(req.params.role_id);
  if (!Number.isInteger(roleId) || roleId <= 0)
    throw new ValidationError("Invalid role ID");

  const dto = new UpdateRoleDto(req.body);
  const updated = await RoleService.update(roleId, dto);
  res.status(200).json(new RoleResponseDto(updated));
}

export async function deleteRole(req, res) {
  const roleId = Number(req.params.role_id);
  if (!Number.isInteger(roleId) || roleId <= 0)
    throw new ValidationError("Invalid role ID");

  const deleted = await RoleService.delete(roleId);
  res.status(200).json(new RoleResponseDto(deleted));
}
