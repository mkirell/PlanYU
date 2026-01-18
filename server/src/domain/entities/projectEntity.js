export class ProjectEntity {
  constructor({ id, name, description } = {}) {
    this.id = id;
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
    const out = {};
    if (this.name !== undefined) out.name = this.name;
    if (this.description !== undefined) out.description = this.description;
    return out;
  }
}

export default ProjectEntity;
