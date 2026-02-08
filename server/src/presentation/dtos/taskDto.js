export class CreateTaskDto {
  constructor({
    project_id,
    title,
    description,
    status_id,
    priority,
    due_date,
  } = {}) {
    this.project_id = project_id;
    this.title = title;
    this.description = description;
    this.status_id = status_id;
    this.priority = priority;
    this.due_date = due_date;
  }
}

export class UpdateTaskDto {
  constructor({
    project_id,
    title,
    description,
    status_id,
    priority,
    due_date,
  } = {}) {
    this.project_id = project_id;
    this.title = title;
    this.description = description;
    this.status_id = status_id;
    this.priority = priority;
    this.due_date = due_date;
  }
}

export default { CreateTaskDto, UpdateTaskDto };
