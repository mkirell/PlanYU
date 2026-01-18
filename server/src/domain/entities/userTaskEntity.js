export class UserTaskEntity {
  constructor({ user_id, task_id, role } = {}) {
    this.user_id = user_id;
    this.task_id = task_id;
    this.role = role;
  }

  toCreateObject() {
    const out = {};
    if (this.user_id !== undefined) out.user_id = this.user_id;
    if (this.task_id !== undefined) out.task_id = this.task_id;
    if (this.role !== undefined) out.role = this.role;
    return out;
  }

  toUpdateObject() {
    const out = {};
    if (this.role !== undefined) out.role = this.role;
    return out;
  }
}

export default UserTaskEntity;
