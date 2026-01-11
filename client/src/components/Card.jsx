import { useState, useEffect, useRef } from "react";

export default function Card({
  task,
  onUpdate,
  onDelete,
  onDragStart,
  readOnly,
  canChangeStatus,
}) {
  const [expanded, setExpanded] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title || "");
  const [draftDescription, setDraftDescription] = useState(
    task.description || ""
  );
  const [draftDifficulty, setDraftDifficulty] = useState(
    task.difficulty || "MEDIUM"
  );
  const [draftStatus, setDraftStatus] = useState(task.status || "TODO");
  const [draftDueDate, setDraftDueDate] = useState(
    task.due_date ? task.due_date.slice(0, 10) : ""
  );
  const difficulties = ["EASY", "MEDIUM", "HARD"];
  const statusButtonClasses = {
    TODO: "btn-todo",
    DOING: "btn-doing",
    DONE: "btn-done",
  };

  const prevTaskIdRef = useRef(task.task_id);

  useEffect(() => {
    const shouldReset = prevTaskIdRef.current !== task.task_id || !expanded;
    if (!shouldReset) return undefined;
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setDraftTitle(task.title || "");
      setDraftDescription(task.description || "");
      setDraftDifficulty(task.difficulty || "MEDIUM");
      setDraftStatus(task.status || "TODO");
      setDraftDueDate(task.due_date ? task.due_date.slice(0, 10) : "");
      prevTaskIdRef.current = task.task_id;
    });
    return () => {
      cancelled = true;
    };
  }, [
    task.task_id,
    task.title,
    task.description,
    task.difficulty,
    task.status,
    task.due_date,
    expanded,
  ]);

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
          value={expanded ? draftTitle : task.title || ""}
          placeholder="Title"
          disabled={readOnly || !expanded}
          onChange={(e) => !readOnly && expanded && setDraftTitle(e.target.value)}
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
              value={expanded ? draftDescription : task.description || ""}
              disabled={readOnly}
              onChange={(e) => !readOnly && setDraftDescription(e.target.value)}
            />
          </label>
          <label>
            Difficulty
            <select
              value={expanded ? draftDifficulty : task.difficulty || "MEDIUM"}
              disabled={readOnly}
              onChange={(e) => !readOnly && setDraftDifficulty(e.target.value)}
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
              value={
                expanded
                  ? draftDueDate
                  : task.due_date
                  ? task.due_date.slice(0, 10)
                  : ""
              }
              disabled={readOnly}
              onChange={(e) => !readOnly && setDraftDueDate(e.target.value)}
            />
          </label>
        </div>
      )}

      <div className="card-actions">
        {["TODO", "DOING", "DONE"].map((status) => (
          <button
            key={status}
            className={`btn tiny ${statusButtonClasses[status]} ${
              (expanded ? draftStatus : task.status) === status ? "active" : ""
            }`}
            onClick={() => {
              if (readOnly || !canChangeStatus) return;
              setDraftStatus(status);
              onUpdate(task.task_id, { status });
            }}
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

      <button
        className="btn small"
        onClick={() => {
          if (readOnly) return setExpanded((s) => !s);
          if (!expanded) return setExpanded(true);
          const patch = {};
          if (draftTitle !== task.title) patch.title = draftTitle;
          if (draftDescription !== task.description)
            patch.description = draftDescription;
          if (draftDifficulty !== task.difficulty)
            patch.difficulty = draftDifficulty;
          if (draftStatus !== task.status) patch.status = draftStatus;
          const iso = draftDueDate
            ? new Date(draftDueDate).toISOString()
            : null;
          const currentIso = task.due_date
            ? new Date(task.due_date).toISOString()
            : null;
          if (iso !== currentIso) patch.due_date = iso;
          if (Object.keys(patch).length) onUpdate(task.task_id, patch);
          setExpanded(false);
        }}
      >
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
