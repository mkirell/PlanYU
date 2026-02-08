import { useState } from "react";
import Card from "../Card/Card.jsx";
import "./Column.css";

const TYPE_LABELS = {
  TODO: "To Do",
  DOING: "In Progress",
  REVIEW: "Review",
  DONE: "Done",
};

export default function Column({
  column,
  columns,
  tasks,
  onDrop,
  onUpdateTask,
  onDeleteTask,
  onDragStart,
  readOnly,
  canChangeStatus,
  projectMembers,
  profiles,
  userTasks,
  canManage,
  onUpdateColumn,
  onDeleteColumn,
}) {
  const normalizeStatusName = (value) => {
    const cleaned = (value || "").trim().replace(/\s+/g, " ").toLowerCase();
    if (!cleaned) return "";
    return cleaned.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
  };

  const toRgba = (hex, alpha) => {
    if (typeof hex !== "string") return null;
    const normalized = hex.replace("#", "").trim();
    const isShort = normalized.length === 3;
    const isLong = normalized.length === 6;
    if (!isShort && !isLong) return null;
    const full = isShort
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized;
    const r = Number.parseInt(full.slice(0, 2), 16);
    const g = Number.parseInt(full.slice(2, 4), 16);
    const b = Number.parseInt(full.slice(4, 6), 16);
    if ([r, g, b].some((v) => Number.isNaN(v))) return null;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(column.name || "");
  const [draftDescription, setDraftDescription] = useState(
    column.description || "",
  );
  const [draftIcon, setDraftIcon] = useState(column.icon || "");
  const [draftColor, setDraftColor] = useState(column.color || "#4a4a4a");
  const [draftType, setDraftType] = useState(column.type || "TODO");
  const [draftOrder, setDraftOrder] = useState(column.sort_order || 0);

  return (
    <div
      className={`column ${column.type ? column.type.toLowerCase() : ""}`}
      style={{
        backgroundColor: "var(--card)",
        borderColor: toRgba(column.color, 0.25) || column.color || undefined,
        borderStyle: "solid",
        borderWidth: "0.1rem",
      }}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(e, column)}
    >
      <div className="column-header">
        <div
          className={`column-title status-icon-flex${editing ? " is-editing" : ""}`}
          style={{ color: column.color || "var(--dark)" }}
          title={!editing && column.description ? column.description : ""}
        >
          {!editing && column.icon ? (
            <span className="status-icon">{column.icon}</span>
          ) : null}
          <input
            className="column-title-input"
            value={
              editing
                ? draftName
                : column.name || TYPE_LABELS[column.type]
            }
            placeholder="Column name"
            disabled={!editing}
            onChange={(e) => editing && setDraftName(e.target.value)}
            onBlur={() =>
              editing && setDraftName(normalizeStatusName(draftName))
            }
          />
        </div>
        {canManage && (
          <div className="column-actions">
            <button
              type="button"
              className="edit-btn"
              onClick={() => {
                setDraftName(column.name || "");
                setDraftDescription(column.description || "");
                setDraftIcon(column.icon || "");
                setDraftColor(column.color || "#4a4a4a");
                setDraftType(column.type || "TODO");
                setDraftOrder(column.sort_order || 0);
                setEditing((prev) => !prev);
              }}
              title="Edit column"
            >
              ✏️
            </button>
            <button
              type="button"
              className="delete"
              onClick={() => onDeleteColumn(column)}
              title="Delete column"
            >
              🗑
            </button>
          </div>
        )}
      </div>

      {editing && canManage && (
        <div className="column-editor">
          <label>
            Description
            <textarea
              rows={4}
              value={draftDescription}
              onChange={(e) => setDraftDescription(e.target.value)}
            />
          </label>
          <label>
            Type
            <select
              value={draftType}
              onChange={(e) => setDraftType(e.target.value)}
            >
              {Object.keys(TYPE_LABELS).map((type) => (
                <option key={type} value={type}>
                  {TYPE_LABELS[type]}
                </option>
              ))}
            </select>
          </label>
          <div className="column-editor-row">
            <label>
              Icon
              <input
                value={draftIcon}
                placeholder="📝"
                onChange={(e) => setDraftIcon(e.target.value)}
              />
            </label>
            <label className="column-editor-color">
              Color
              <input
                type="color"
                value={draftColor}
                onChange={(e) => setDraftColor(e.target.value)}
              />
            </label>
            <label>
              Order
              <input
                type="number"
                min="0"
                value={draftOrder}
                onChange={(e) => setDraftOrder(Number(e.target.value))}
              />
            </label>
          </div>
          <div className="column-editor-actions">
            <button
              type="button"
              className="btn small"
              onClick={() => {
                onUpdateColumn(column.status_id, {
                  name: normalizeStatusName(draftName),
                  description: draftDescription.trim() || null,
                  icon: draftIcon || null,
                  color: draftColor || null,
                  type: draftType,
                  sort_order: draftOrder,
                });
                setEditing(false);
              }}
            >
              Save
            </button>
            <button
              type="button"
              className="btn small"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="list">
        {tasks.map((task) => (
          <Card
            key={task.task_id}
            task={task}
            onUpdate={onUpdateTask}
            onDelete={() => onDeleteTask(task.task_id)}
            onDragStart={onDragStart}
            readOnly={readOnly}
            canChangeStatus={canChangeStatus}
            projectMembers={projectMembers}
            profiles={profiles}
            userTasks={userTasks}
            columns={columns}
          />
        ))}
      </div>
    </div>
  );
}
