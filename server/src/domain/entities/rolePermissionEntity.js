class RolePermissionEntity {
  constructor({ role_id, permission_id } = {}) {
    this.role_id = role_id;
    this.permission_id = permission_id;
  }

  toCreateObject() {
    const out = {};
    if (this.role_id !== undefined) out.role_id = this.role_id;
    if (this.permission_id !== undefined) out.permission_id = this.permission_id;
    return out;
  }

  toUpdateObject() {
    return this.toCreateObject();
  }
}

export default RolePermissionEntity;
