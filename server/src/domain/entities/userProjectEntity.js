export class UserProjectEntity {
  constructor({ user_id, project_id, role } = {}) {
    this.user_id = user_id;
    this.project_id = project_id;
    this.role = role;
  }

  toCreateObject() {
    const out = {};
    if (this.user_id !== undefined) out.user_id = this.user_id;
    if (this.project_id !== undefined) out.project_id = this.project_id;
    if (this.role !== undefined) out.role = this.role;
    return out;
  }

  toUpdateObject() {
    const out = {};
    if (this.role !== undefined) out.role = this.role;
    return out;
  }
}

export default UserProjectEntity;
