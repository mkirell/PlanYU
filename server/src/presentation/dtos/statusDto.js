export class CreateStatusDto {
  constructor({
    project_id,
    name,
    description,
    type,
    icon,
    color,
    sort_order,
  } = {}) {
    this.project_id = project_id;
    this.name = name;
    this.description = description;
    this.type = type;
    this.icon = icon;
    this.color = color;
    this.sort_order = sort_order;
  }
}

export class UpdateStatusDto {
  constructor({ name, description, type, icon, color, sort_order } = {}) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.icon = icon;
    this.color = color;
    this.sort_order = sort_order;
  }
}

export default { CreateStatusDto, UpdateStatusDto };
