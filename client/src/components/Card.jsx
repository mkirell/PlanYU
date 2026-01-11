import { useState } from "react";

export default function Card({
  task,
  onUpdate,
  onDelete,
  onDragStart,
  readOnly,
  canChangeStatus,
}) {
  const [expanded, setExpanded] = useState(false);
  const difficulties = ["EASY", "MEDIUM", "HARD"];
  const statusButtonClasses = {
    TODO: "btn-todo",
    DOING: "btn-doing",
    DONE: "btn-done",
  };

  const handleChange = (field, value) => {
    if (!canChangeStatus) return;
    if (field === "status") onUpdate(task.task_id, { status: value });
  };

  const capitalize = (str) =>
    str ? str[0].toUpperCase() + str.slice(1).toLowerCase() : "";

  const getRemainingShort = (dueDate) => {
    if (!dueDate) return "";
    const now = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.floor(
      (new Date(due.getFullYear(), due.getMonth(), due.getDate()) -
        new Date(now.getFullYear(), now.getMonth(), now.getDate())) /
        (1000 * 60 * 60 * 24)
    );
    if (diffDays < 0) return "Overdue";
    if (diffDays === 0) return "Today";
    if (diffDays < 7) return `${diffDays}d`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}w`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)}m`;
    return `${Math.floor(diffDays / 365)}y`;
  };

  const getRemainingClass = (dueDate) => {
    if (!dueDate) return "";
    const now = new Date();
    const due = new Date(dueDate);
    return new Date(due.getFullYear(), due.getMonth(), due.getDate()) >=
      new Date(now.getFullYear(), now.getMonth(), now.getDate())
      ? "due-future"
      : "due-past";
  };

  return (
    <article
      className="card"
      draggable={canChangeStatus}
      onDragStart={(e) => canChangeStatus && onDragStart(e, task.task_id)}
    >
      <div className="card-top">
        <input
          className="card-title-input"
          value={task.title || ""}
          placeholder="Title"
          disabled={readOnly || !expanded}
          onChange={(e) =>
            !readOnly &&
            expanded &&
            onUpdate(task.task_id, { title: e.target.value })
          }
        />
        {task.due_date && (
          <div className={`chip due ${getRemainingClass(task.due_date)}`}>
            {getRemainingShort(task.due_date)}
          </div>
        )}
      </div>

      {expanded && (
        <div className="card-body">
          <label>
            Description
            <textarea
              value={task.description || ""}
              disabled={readOnly}
              onChange={(e) =>
                !readOnly &&
                onUpdate(task.task_id, { description: e.target.value })
              }
            />
          </label>
          <label>
            Difficulty
            <select
              value={task.difficulty || "MEDIUM"}
              disabled={readOnly}
              onChange={(e) =>
                !readOnly &&
                onUpdate(task.task_id, { difficulty: e.target.value })
              }
            >
              {difficulties.map((d) => (
                <option key={d} value={d}>
                  {capitalize(d)}
                </option>
              ))}
            </select>
          </label>
          <label>
            Due Date
            <input
              type="date"
              value={task.due_date ? task.due_date.slice(0, 10) : ""}
              disabled={readOnly}
              onChange={(e) =>
                !readOnly &&
                onUpdate(task.task_id, {
                  due_date: new Date(e.target.value).toISOString(),
                })
              }
            />
          </label>
        </div>
      )}

      <div className="card-actions">
        {["TODO", "DOING", "DONE"].map((status) => (
          <button
            key={status}
            className={`btn tiny ${statusButtonClasses[status]} ${
              task.status === status ? "active" : ""
            }`}
            onClick={() => handleChange("status", status)}
            disabled={!canChangeStatus}
          >
            {status}
          </button>
        ))}
        <div className="spacer" />
        {!readOnly && (
          <button
            className="btn danger tiny"
            onClick={() => onDelete(task.task_id)}
          >
            x
          </button>
        )}
      </div>

      <button className="btn small" onClick={() => setExpanded(!expanded)}>
        {readOnly
          ? expanded
            ? "Collapse"
            : "Details"
          : expanded
          ? "Save"
          : "Edit"}
      </button>
    </article>
  );
}
