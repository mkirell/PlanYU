class RoleEntity {
  constructor({ role_id, name, description } = {}) {
    this.role_id = role_id;
    this.name = name;
    this.description = description;
  }

  toCreateObject() {
    const out = {};
    if (this.name !== undefined) out.name = this.name;
    if (this.description !== undefined) out.description = this.description;
    return out;
  }

  toUpdateObject() {
    return this.toCreateObject();
  }
}

export default RoleEntity;
