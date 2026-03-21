class PermissionEntity {
  constructor({ permission_id, resource, action, description } = {}) {
    this.permission_id = permission_id;
    this.resource = resource;
    this.action = action;
    this.description = description;
  }

  toCreateObject() {
    const out = {};
    if (this.resource !== undefined) out.resource = this.resource;
    if (this.action !== undefined) out.action = this.action;
    if (this.description !== undefined) out.description = this.description;
    return out;
  }

  toUpdateObject() {
    return this.toCreateObject();
  }
}

export default PermissionEntity;
