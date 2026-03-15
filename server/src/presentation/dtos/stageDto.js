export class CreateStageDto {
  constructor({
    project_id,
    name,
    description,
    status,
    icon,
    color,
    sort_order,
  } = {}) {
    this.project_id = project_id;
    this.name = name;
    this.description = description;
    this.status = status;
    this.icon = icon;
    this.color = color;
    this.sort_order = sort_order;
  }
}

export class UpdateStageDto {
  constructor({ name, description, status, icon, color, sort_order } = {}) {
    this.name = name;
    this.description = description;
    this.status = status;
    this.icon = icon;
    this.color = color;
    this.sort_order = sort_order;
  }
}

export default { CreateStageDto, UpdateStageDto };
