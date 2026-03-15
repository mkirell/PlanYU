export class StageEntity {
  constructor({
    stage_id,
    project_id,
    name,
    description,
    status,
    icon,
    color,
    sort_order,
  } = {}) {
    this.stage_id = stage_id;
    this.project_id = project_id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.icon = icon;
    this.color = color;
    this.sort_order = sort_order;
  }

  toCreateObject() {
    const out = {};
    if (this.project_id !== undefined) out.project_id = this.project_id;
    if (this.name !== undefined) out.name = this.name;
    if (this.description !== undefined) out.description = this.description;
    if (this.status !== undefined) out.status = this.status;
    if (this.icon !== undefined) out.icon = this.icon;
    if (this.color !== undefined) out.color = this.color;
    if (this.sort_order !== undefined) out.sort_order = this.sort_order;
    return out;
  }

  toUpdateObject() {
    const out = {};
    if (this.name !== undefined) out.name = this.name;
    if (this.description !== undefined) out.description = this.description;
    if (this.status !== undefined) out.status = this.status;
    if (this.icon !== undefined) out.icon = this.icon;
    if (this.color !== undefined) out.color = this.color;
    if (this.sort_order !== undefined) out.sort_order = this.sort_order;
    return out;
  }
}

export default StageEntity;
