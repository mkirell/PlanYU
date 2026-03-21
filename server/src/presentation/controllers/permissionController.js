import PermissionService from "../../application/services/permissionService.js";
import {
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionResponseDto,
} from "../dtos/permissionDto.js";
import { ValidationError } from "../../shared/errors/appError.js";

export async function getAllPermissions(req, res) {
  const permissions = await PermissionService.list();
  res
    .status(200)
    .json(permissions.map((permission) => new PermissionResponseDto(permission)));
}

export async function getPermissionById(req, res) {
  const permissionId = Number(req.params.permission_id);
  if (!Number.isInteger(permissionId) || permissionId <= 0)
    throw new ValidationError("Invalid permission ID");

  const permission = await PermissionService.get(permissionId);
  res.status(200).json(new PermissionResponseDto(permission));
}

export async function createPermission(req, res) {
  const dto = new CreatePermissionDto(req.body);
  const created = await PermissionService.create(dto);
  res.status(201).json(new PermissionResponseDto(created));
}

export async function updatePermission(req, res) {
  const permissionId = Number(req.params.permission_id);
  if (!Number.isInteger(permissionId) || permissionId <= 0)
    throw new ValidationError("Invalid permission ID");

  const dto = new UpdatePermissionDto(req.body);
  const updated = await PermissionService.update(permissionId, dto);
  res.status(200).json(new PermissionResponseDto(updated));
}

export async function deletePermission(req, res) {
  const permissionId = Number(req.params.permission_id);
  if (!Number.isInteger(permissionId) || permissionId <= 0)
    throw new ValidationError("Invalid permission ID");

  const deleted = await PermissionService.delete(permissionId);
  res.status(200).json(new PermissionResponseDto(deleted));
}
