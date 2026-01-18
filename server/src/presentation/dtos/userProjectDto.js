export class CreateUserProjectDto {
  constructor({ user_id, project_id, role } = {}) {
    this.user_id = user_id;
    this.project_id = project_id;
    this.role = role;
  }
}

export class UpdateUserProjectDto {
  constructor({ role } = {}) {
    this.role = role;
  }
}

export default { CreateUserProjectDto, UpdateUserProjectDto };
