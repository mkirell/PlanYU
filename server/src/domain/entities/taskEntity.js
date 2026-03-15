export class TaskEntity {
  constructor({
    id,
    project_id,
    title,
    description,
    stage_id,
    priority,
    due_date,
  } = {}) {
    this.id = id;
    this.project_id = project_id;
    this.title = title;
    this.description = description;
    this.stage_id = stage_id;
    this.priority = priority;
    this.due_date = due_date;
  }

  toCreateObject() {
    const out = {};
    if (this.project_id !== undefined) out.project_id = this.project_id;
    if (this.title !== undefined) out.title = this.title;
    if (this.description !== undefined) out.description = this.description;
    if (this.stage_id !== undefined) out.stage_id = this.stage_id;
    if (this.priority !== undefined) out.priority = this.priority;
    if (this.due_date !== undefined) out.due_date = this.due_date;
    return out;
  }

  toUpdateObject() {
    const out = {};
    if (this.project_id !== undefined) out.project_id = this.project_id;
    if (this.title !== undefined) out.title = this.title;
    if (this.description !== undefined) out.description = this.description;
    if (this.stage_id !== undefined) out.stage_id = this.stage_id;
    if (this.priority !== undefined) out.priority = this.priority;
    if (this.due_date !== undefined) out.due_date = this.due_date;
    return out;
  }
}

export default TaskEntity;
