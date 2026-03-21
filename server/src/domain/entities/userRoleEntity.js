class UserRoleEntity {
  constructor({ user_id, role_id } = {}) {
    this.user_id = user_id;
    this.role_id = role_id;
  }

  toCreateObject() {
    const out = {};
    if (this.user_id !== undefined) out.user_id = this.user_id;
    if (this.role_id !== undefined) out.role_id = this.role_id;
    return out;
  }

  toUpdateObject() {
    return this.toCreateObject();
  }
}

export default UserRoleEntity;
