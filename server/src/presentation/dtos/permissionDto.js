export class CreatePermissionDto {
  constructor({ resource, action, description } = {}) {
    this.resource = resource;
    this.action = action;
    this.description = description;
  }
}

export class UpdatePermissionDto {
  constructor({ resource, action, description } = {}) {
    this.resource = resource;
    this.action = action;
    this.description = description;
  }
}

export class PermissionResponseDto {
  constructor(permission = {}) {
    const source = permission && permission.dataValues ? permission.dataValues : permission;
    Object.assign(this, source);
  }
}

export default {
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionResponseDto,
};
