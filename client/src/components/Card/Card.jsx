import { useState, useEffect, useRef } from "react";
import Chip from "../Chip/Chip.jsx";
import { useDispatch } from "react-redux";
import {
  createUserTask,
  deleteUserTask,
} from "../../features/userTasks/userTaskThunks";
import "./Card.css";

export default function Card({
  task,
  onUpdate,
  onDelete,
  onDragStart,
  readOnly,
  canChangeStatus,
  projectMembers = [],
  profiles = [],
  userTasks = [],
  currentUserId,
}) {
  const [expanded, setExpanded] = useState(false);
  const [draftTitle, setDraftTitle] = useState(task.title || "");
  const [draftDescription, setDraftDescription] = useState(
    task.description || "",
  );
  const [draftDifficulty, setDraftDifficulty] = useState(
    task.difficulty || "MEDIUM",
  );
  const [draftStatus, setDraftStatus] = useState(task.status || "TODO");
  const [draftDueDate, setDraftDueDate] = useState(
    task.due_date ? task.due_date.slice(0, 10) : "",
  );
  const difficulties = ["EASY", "MEDIUM", "HARD"];
  const statusButtonClasses = {
    TODO: "btn-todo",
    DOING: "btn-doing",
    DONE: "btn-done",
  };

  const prevTaskIdRef = useRef(task.task_id);
  const dispatch = useDispatch();
  const [pendingAddAssignees, setPendingAddAssignees] = useState([]);
  const [pendingAddReviewers, setPendingAddReviewers] = useState([]);
  const [pendingRemoveAssignees, setPendingRemoveAssignees] = useState([]);
  const [pendingRemoveReviewers, setPendingRemoveReviewers] = useState([]);

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) return;
      setPendingAddAssignees([]);
      setPendingAddReviewers([]);
      setPendingRemoveAssignees([]);
      setPendingRemoveReviewers([]);
    });
    return () => {
      cancelled = true;
    };
  }, [task.task_id]);

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
        (1000 * 60 * 60 * 24),
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
          onChange={(e) =>
            !readOnly && expanded && setDraftTitle(e.target.value)
          }
        />
        <div className="card-top-right">
          {task.due_date && (
            <div className={`chip due ${getRemainingClass(task.due_date)}`}>
              {getRemainingShort(task.due_date)}
            </div>
          )}
          {!readOnly && (
            <button
              className="btn tiny delete-btn-top"
              onClick={() => onDelete(task.task_id)}
              title="Delete task"
            >
              &times;
            </button>
          )}
        </div>
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

          <div className="assignment-section">
            <div className="assignment-group">
              <strong>Assignees</strong>
              <div className="chips">
                {userTasks
                  .filter(
                    (ut) =>
                      ut.task_id === task.task_id && ut.role === "ASSIGNEE",
                  )
                  .map((ut) => {
                    const prof =
                      profiles.find((p) => p.user_id === ut.user_id) || {};
                    const removing = pendingRemoveAssignees.includes(
                      ut.user_id,
                    );
                    return (
                      <Chip
                        key={ut.user_id}
                        id={ut.user_id}
                        profile={prof}
                        removing={removing}
                        onClick={() => {
                          if (readOnly) return;
                          setPendingRemoveAssignees((prev) =>
                            prev.includes(ut.user_id)
                              ? prev.filter((id) => id !== ut.user_id)
                              : [...prev, ut.user_id],
                          );
                        }}
                      />
                    );
                  })}

                {pendingAddAssignees.map((uid) => {
                  const prof = profiles.find((p) => p.user_id === uid) || {};
                  return (
                    <Chip
                      key={`pending-a-${uid}`}
                      id={uid}
                      profile={prof}
                      pending
                      onClick={() => {
                        if (readOnly) return;
                        setPendingAddAssignees((prev) =>
                          prev.filter((id) => id !== uid),
                        );
                      }}
                    />
                  );
                })}
              </div>
              {!readOnly && (
                <select
                  onChange={(e) => {
                    const uid = Number(e.target.value);
                    if (!uid) return;
                    setPendingAddAssignees((prev) =>
                      prev.includes(uid) ? prev : [...prev, uid],
                    );
                    e.target.value = "";
                  }}
                >
                  <option value="">+ Add assignee</option>
                  {projectMembers
                    .filter(
                      (m) =>
                        !userTasks.find(
                          (ut) =>
                            ut.task_id === task.task_id &&
                            ut.user_id === m.user_id,
                        ) &&
                        !pendingAddAssignees.includes(m.user_id) &&
                        m.user_id !== currentUserId,
                    )
                    .map((m) => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.full_name} {m.email ? `(${m.email})` : ""}
                      </option>
                    ))}
                </select>
              )}
            </div>

            <div className="assignment-group">
              <strong>Reviewers</strong>
              <div className="chips">
                {userTasks
                  .filter(
                    (ut) =>
                      ut.task_id === task.task_id && ut.role === "REVIEWER",
                  )
                  .map((ut) => {
                    const prof =
                      profiles.find((p) => p.user_id === ut.user_id) || {};
                    const removing = pendingRemoveReviewers.includes(
                      ut.user_id,
                    );
                    return (
                      <Chip
                        key={ut.user_id}
                        id={ut.user_id}
                        profile={prof}
                        removing={removing}
                        onClick={() => {
                          if (readOnly) return;
                          setPendingRemoveReviewers((prev) =>
                            prev.includes(ut.user_id)
                              ? prev.filter((id) => id !== ut.user_id)
                              : [...prev, ut.user_id],
                          );
                        }}
                      />
                    );
                  })}

                {pendingAddReviewers.map((uid) => {
                  const prof = profiles.find((p) => p.user_id === uid) || {};
                  return (
                    <Chip
                      key={`pending-r-${uid}`}
                      id={uid}
                      profile={prof}
                      pending
                      onClick={() => {
                        if (readOnly) return;
                        setPendingAddReviewers((prev) =>
                          prev.filter((id) => id !== uid),
                        );
                      }}
                    />
                  );
                })}
              </div>
              {!readOnly && (
                <select
                  onChange={(e) => {
                    const uid = Number(e.target.value);
                    if (!uid) return;
                    setPendingAddReviewers((prev) =>
                      prev.includes(uid) ? prev : [...prev, uid],
                    );
                    e.target.value = "";
                  }}
                >
                  <option value="">+ Add reviewer</option>
                  {currentUserId &&
                    !userTasks.find(
                      (ut) =>
                        ut.task_id === task.task_id &&
                        ut.user_id === currentUserId,
                    ) &&
                    !pendingAddReviewers.includes(currentUserId) && (
                      <option
                        key={`me-r-${currentUserId}`}
                        value={currentUserId}
                      >
                        {profiles.find((p) => p.user_id === currentUserId)
                          ?.full_name || "Me"}{" "}
                        (You)
                      </option>
                    )}
                  {projectMembers
                    .filter(
                      (m) =>
                        !userTasks.find(
                          (ut) =>
                            ut.task_id === task.task_id &&
                            ut.user_id === m.user_id,
                        ) &&
                        !pendingAddReviewers.includes(m.user_id) &&
                        m.user_id !== currentUserId,
                    )
                    .map((m) => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.full_name} {m.email ? `(${m.email})` : ""}
                      </option>
                    ))}
                </select>
              )}
            </div>
          </div>
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
              if (!canChangeStatus) return;
              setDraftStatus(status);
              onUpdate(task.task_id, { status });
            }}
            disabled={!canChangeStatus}
          >
            {status}
          </button>
        ))}
        <div className="spacer" />
        <div className="task-members">
          {(() => {
            const assigneeUids = userTasks
              .filter(
                (ut) => ut.task_id === task.task_id && ut.role === "ASSIGNEE",
              )
              .map((ut) => ut.user_id);
            const reviewerUids = userTasks
              .filter(
                (ut) => ut.task_id === task.task_id && ut.role === "REVIEWER",
              )
              .map((ut) => ut.user_id);
            const uids = Array.from(
              new Set([...assigneeUids, ...reviewerUids]),
            );
            const visible = uids.slice(0, 2);
            const more = Math.max(0, uids.length - visible.length);
            const remainingNames = uids
              .slice(visible.length)
              .map(
                (uid) =>
                  profiles.find((p) => p.user_id === uid)?.full_name ||
                  String(uid),
              )
              .join(", ");
            return (
              <>
                {visible.map((uid) => {
                  const prof = profiles.find((p) => p.user_id === uid) || {};
                  return (
                    <div
                      key={uid}
                      className="task-member-avatar-wrapper"
                      title={prof.full_name}
                    >
                      <img
                        className="task-member-avatar"
                        src={prof.avatar_url}
                        alt={prof.full_name}
                      />
                    </div>
                  );
                })}
                {more > 0 && (
                  <div className="task-member-more" title={remainingNames}>
                    +{more}
                  </div>
                )}
              </>
            );
          })()}
        </div>
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

          const runStaged = () => {
            const creates = [];
            const removes = [];
            pendingAddAssignees.forEach((uid) =>
              creates.push(
                dispatch(
                  createUserTask({
                    user_id: uid,
                    task_id: task.task_id,
                    role: "ASSIGNEE",
                  }),
                ),
              ),
            );
            pendingAddReviewers.forEach((uid) =>
              creates.push(
                dispatch(
                  createUserTask({
                    user_id: uid,
                    task_id: task.task_id,
                    role: "REVIEWER",
                  }),
                ),
              ),
            );
            pendingRemoveAssignees.forEach((uid) =>
              removes.push(
                dispatch(
                  deleteUserTask({ user_id: uid, task_id: task.task_id }),
                ),
              ),
            );
            pendingRemoveReviewers.forEach((uid) =>
              removes.push(
                dispatch(
                  deleteUserTask({ user_id: uid, task_id: task.task_id }),
                ),
              ),
            );

            return Promise.all([...creates, ...removes]).then(() => {
              setPendingAddAssignees([]);
              setPendingAddReviewers([]);
              setPendingRemoveAssignees([]);
              setPendingRemoveReviewers([]);
            });
          };

          if (Object.keys(patch).length) {
            const res = onUpdate(task.task_id, patch);
            if (res && typeof res.then === "function") {
              res.then(() => runStaged());
            } else {
              runStaged();
            }
          } else {
            runStaged();
          }

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
