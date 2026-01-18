export class TaskEntity {
  constructor({
    id,
    project_id,
    title,
    description,
    status,
    difficulty,
    due_date,
  } = {}) {
    this.id = id;
    this.project_id = project_id;
    this.title = title;
    this.description = description;
    this.status = status;
    this.difficulty = difficulty;
    this.due_date = due_date;
  }

  toCreateObject() {
    const out = {};
    if (this.project_id !== undefined) out.project_id = this.project_id;
    if (this.title !== undefined) out.title = this.title;
    if (this.description !== undefined) out.description = this.description;
    if (this.status !== undefined) out.status = this.status;
    if (this.difficulty !== undefined) out.difficulty = this.difficulty;
    if (this.due_date !== undefined) out.due_date = this.due_date;
    return out;
  }

  toUpdateObject() {
    const out = {};
    if (this.project_id !== undefined) out.project_id = this.project_id;
    if (this.title !== undefined) out.title = this.title;
    if (this.description !== undefined) out.description = this.description;
    if (this.status !== undefined) out.status = this.status;
    if (this.difficulty !== undefined) out.difficulty = this.difficulty;
    if (this.due_date !== undefined) out.due_date = this.due_date;
    return out;
  }
}

export default TaskEntity;
