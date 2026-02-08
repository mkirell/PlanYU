export class StatusEntity {
  constructor({
    status_id,
    project_id,
    name,
    description,
    type,
    icon,
    color,
    sort_order,
  } = {}) {
    this.status_id = status_id;
    this.project_id = project_id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.icon = icon;
    this.color = color;
    this.sort_order = sort_order;
  }

  toCreateObject() {
    const out = {};
    if (this.project_id !== undefined) out.project_id = this.project_id;
    if (this.name !== undefined) out.name = this.name;
    if (this.description !== undefined) out.description = this.description;
    if (this.type !== undefined) out.type = this.type;
    if (this.icon !== undefined) out.icon = this.icon;
    if (this.color !== undefined) out.color = this.color;
    if (this.sort_order !== undefined) out.sort_order = this.sort_order;
    return out;
  }

  toUpdateObject() {
    const out = {};
    if (this.name !== undefined) out.name = this.name;
    if (this.description !== undefined) out.description = this.description;
    if (this.type !== undefined) out.type = this.type;
    if (this.icon !== undefined) out.icon = this.icon;
    if (this.color !== undefined) out.color = this.color;
    if (this.sort_order !== undefined) out.sort_order = this.sort_order;
    return out;
  }
}

export default StatusEntity;
