export class AssignUserRoleDto {
  constructor({ role_id } = {}) {
    this.role_id = role_id;
  }
}

export class ReplaceUserRolesDto {
  constructor({ role_ids } = {}) {
    this.role_ids = role_ids;
  }
}

export class UserRoleResponseDto {
  constructor(userRole = {}) {
    const source = userRole && userRole.dataValues ? userRole.dataValues : userRole;
    Object.assign(this, source);
  }
}

export default { AssignUserRoleDto, ReplaceUserRolesDto, UserRoleResponseDto };
