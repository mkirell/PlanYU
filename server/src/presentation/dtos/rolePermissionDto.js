export class AssignRolePermissionDto {
  constructor({ permission_id } = {}) {
    this.permission_id = permission_id;
  }
}

export class ReplaceRolePermissionsDto {
  constructor({ permission_ids } = {}) {
    this.permission_ids = permission_ids;
  }
}

export class RolePermissionResponseDto {
  constructor(rolePermission = {}) {
    const source =
      rolePermission && rolePermission.dataValues
        ? rolePermission.dataValues
        : rolePermission;
    Object.assign(this, source);
  }
}

export default {
  AssignRolePermissionDto,
  ReplaceRolePermissionsDto,
  RolePermissionResponseDto,
};
