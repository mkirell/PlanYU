export class CreateRoleDto {
  constructor({ name, description } = {}) {
    this.name = name;
    this.description = description;
  }
}

export class UpdateRoleDto {
  constructor({ name, description } = {}) {
    this.name = name;
    this.description = description;
  }
}

export class RoleResponseDto {
  constructor(role = {}) {
    const source = role && role.dataValues ? role.dataValues : role;
    Object.assign(this, source);
  }
}

export default { CreateRoleDto, UpdateRoleDto, RoleResponseDto };
