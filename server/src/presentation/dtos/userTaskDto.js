export class CreateUserTaskDto {
  constructor({ user_id, task_id, role } = {}) {
    this.user_id = user_id;
    this.task_id = task_id;
    this.role = role;
  }
}

export class UpdateUserTaskDto {
  constructor({ role } = {}) {
    this.role = role;
  }
}

export default { CreateUserTaskDto, UpdateUserTaskDto };
