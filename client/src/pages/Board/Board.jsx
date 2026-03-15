import { useState, useMemo, useEffect, useRef, useLayoutEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Column from "../../components/Column/Column.jsx";
import Profile from "../../components/Profile/Profile.jsx";
import Form from "../../components/Form/Form.jsx";
import Modal from "../../components/Modal/Modal.jsx";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../../features/projects/projectThunks";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../../features/tasks/taskThunks";
import {
  fetchStages,
  createStage,
  updateStage,
  deleteStage,
} from "../../features/stages/stageThunks";
import { fetchUserTasks } from "../../features/userTasks/userTaskThunks";
import { fetchUsers } from "../../features/users/userThunks";
import {
  fetchProfiles,
  updateProfile,
} from "../../features/profiles/profileThunks";
import {
  fetchUserProjects,
  createUserProject,
  deleteUserProject,
} from "../../features/userProjects/userProjectThunks";
import "./Board.css";

export default function Board({ currentUserId, onLogout }) {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.list);
  const stages = useSelector((state) => state.stages.list);
  const tasks = useSelector((state) => state.tasks.list);
  const userTasks = useSelector((state) => state.userTasks.list);
  const users = useSelector((state) => state.users.list);
  const profiles = useSelector((state) => state.profiles.list);
  const userProjects = useSelector((state) => state.userProjects.list);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [memberFilterUserIds, setMemberFilterUserIds] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(() => {});
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth <= 575;
  });
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [showMoreDescription, setShowMoreDescription] = useState(false);
  const didLoadRef = useRef(false);
  const descriptionRef = useRef(null);

  const normalizeStatusName = (value) => {
    const cleaned = (value || "").trim().replace(/\s+/g, " ").toLowerCase();
    if (!cleaned) return "";
    return cleaned.replace(/(^|\s)\S/g, (c) => c.toUpperCase());
  };

  const userProjectRoles = useMemo(
    () =>
      userProjects
        .filter(
          (up) =>
            up.user_id === currentUserId &&
            (up.role === "OWNER" || up.role === "MEMBER"),
        )
        .reduce((acc, up) => {
          acc[up.project_id] = up.role;
          return acc;
        }, {}),
    [userProjects, currentUserId],
  );

  const visibleProjects = useMemo(
    () =>
      projects
        .filter((p) => userProjectRoles[p.project_id])
        .sort((a, b) => {
          const roleA = userProjectRoles[a.project_id];
          const roleB = userProjectRoles[b.project_id];
          if (roleA === roleB) return 0;
          return roleA === "OWNER" ? -1 : 1;
        }) || [],
    [projects, userProjectRoles],
  );

  useEffect(() => {
    if (didLoadRef.current) return;
    didLoadRef.current = true;
    Promise.all([
      dispatch(fetchProjects()),
      dispatch(fetchStages()),
      dispatch(fetchTasks()),
      dispatch(fetchUserTasks()),
      dispatch(fetchUsers()),
      dispatch(fetchProfiles()),
      dispatch(fetchUserProjects()),
    ]).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => setIsMobile(window.innerWidth <= 575);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!loading) {
      if (!selectedProjectId && visibleProjects.length > 0) {
        setTimeout(
          () => setSelectedProjectId(visibleProjects[0].project_id),
          0,
        );
      } else if (visibleProjects.length === 0) {
        setTimeout(() => setModalOpen(true), 0);
      }
    }
  }, [loading, visibleProjects, selectedProjectId]);

  useEffect(() => {
    if (!selectedProjectId) return;
    dispatch(fetchStages({ project_id: selectedProjectId }));
  }, [dispatch, selectedProjectId]);

  const selectedProject = useMemo(
    () => visibleProjects.find((p) => p.project_id === selectedProjectId),
    [visibleProjects, selectedProjectId],
  );

  const projectTasks = useMemo(
    () =>
      tasks
        .filter((t) => t.project_id === selectedProjectId)
        .filter((t) => {
          if (!memberFilterUserIds || memberFilterUserIds.length === 0)
            return true;
          return userTasks.some(
            (ut) =>
              ut.task_id === t.task_id &&
              memberFilterUserIds.includes(ut.user_id),
          );
        }),
    [tasks, selectedProjectId, memberFilterUserIds, userTasks],
  );

  const projectStages = useMemo(() => {
    return stages
      .filter((c) => c.project_id === selectedProjectId)
      .sort((a, b) => {
        const orderA = a.sort_order ?? 0;
        const orderB = b.sort_order ?? 0;
        if (orderA !== orderB) return orderA - orderB;
        return (a.stage_id ?? 0) - (b.stage_id ?? 0);
      });
  }, [stages, selectedProjectId]);

  const projectMembers = useMemo(
    () =>
      userProjects
        .filter(
          (up) => up.project_id === selectedProjectId && up.role === "MEMBER",
        )
        .map((up) => profiles.find((p) => p.user_id === up.user_id))
        .filter(Boolean),
    [selectedProjectId, userProjects, profiles],
  );

  const currentUserRole = useMemo(
    () => userProjectRoles[selectedProjectId] || "MEMBER",
    [selectedProjectId, userProjectRoles],
  );

  const isCreatingFirstProject = useMemo(
    () => modalOpen && !editingProject && visibleProjects.length === 0,
    [modalOpen, editingProject, visibleProjects],
  );

  const projectRoleClass =
    isCreatingFirstProject || currentUserRole === "OWNER" ? "owner" : "member";

  const projectDescription = selectedProject?.description || "No description";
  useLayoutEffect(() => {
    const el = descriptionRef.current;
    if (!el) return undefined;

    let rafId = 0;
    const updateToggle = () => {
      if (projectDescription === "No description") {
        setShowMoreDescription(false);
        if (isDescriptionExpanded) setIsDescriptionExpanded(false);
        return;
      }

      const wasExpanded = el.classList.contains("expanded");
      if (wasExpanded) el.classList.remove("expanded");
      const needsToggle = el.scrollHeight > el.clientHeight + 1;
      if (wasExpanded) el.classList.add("expanded");
      setShowMoreDescription(needsToggle);
      if (!needsToggle && isDescriptionExpanded)
        setIsDescriptionExpanded(false);
    };

    const observer = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateToggle);
    });

    observer.observe(el);
    rafId = requestAnimationFrame(updateToggle);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [projectDescription, isMobile, isDescriptionExpanded]);

  const defaultStage = useMemo(() => {
    if (!projectStages.length) return null;
    return (
      projectStages.find((stage) => stage.status === "TODO") ||
      projectStages[0]
    );
  }, [projectStages]);

  const handleUpdateTask = (task_id, patch) =>
    dispatch(updateTask({ id: task_id, data: patch }));

  const handleUpdateStage = async (stage_id, patch) => {
    const action = await dispatch(updateStage({ id: stage_id, data: patch }));
    if (action.type.endsWith("fulfilled")) {
      dispatch(fetchStages({ project_id: selectedProjectId }));
    }
  };

  const handleDeleteTask = (task_id) => dispatch(deleteTask(task_id));

  const handleCreateTask = ({
    title,
    description = "",
    priority = "",
    due_date = null,
  }) => {
    if (currentUserRole !== "OWNER" || !title) return;
    if (!defaultStage) return;
    dispatch(
      createTask({
        project_id: selectedProjectId,
        title,
        description,
        stage_id: defaultStage.stage_id,
        priority,
        due_date: due_date
          ? new Date(due_date).toISOString()
          : new Date().toISOString(),
      }),
    );
  };

  const handleDrop = (e, column) => {
    const raw = e.dataTransfer.getData("text/plain");
    if (!raw) return;
    const parsed = Number(raw);
    const id = Number.isNaN(parsed) ? raw : parsed;
    if (!column?.stage_id) return;
    handleUpdateTask(id, { stage_id: column.stage_id });
  };

  const handleDeleteProjectConfirm = () => {
    setConfirmMessage("Are you sure you want to delete this project?");
    setConfirmAction(() => () => {
      removeProject();
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleDeleteTaskConfirm = (task_id) => {
    setConfirmMessage("Are you sure you want to delete this task?");
    setConfirmAction(() => () => {
      handleDeleteTask(task_id);
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleDeleteStageConfirm = (column) => {
    setConfirmMessage(
      `Are you sure you want to delete the stage "${column.name}"?`,
    );
    setConfirmAction(() => () => {
      dispatch(deleteStage(column.stage_id));
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const handleLogoutConfirm = () => {
    setConfirmMessage("Are you sure you want to log out?");
    setConfirmAction(() => () => {
      onLogout();
      setConfirmOpen(false);
    });
    setConfirmOpen(true);
  };

  const removeProject = () => {
    if (!selectedProject || currentUserRole !== "OWNER") return;
    const deletedProjectId = selectedProject.project_id;
    dispatch(deleteProject(deletedProjectId));
    const remainingProjects = visibleProjects.filter(
      (p) => p.project_id !== deletedProjectId,
    );
    setIsDescriptionExpanded(false);
    setSelectedProjectId(remainingProjects[0]?.project_id || null);
    if (remainingProjects.length === 0) {
      setEditingProject(null);
      setModalOpen(true);
    }
  };

  const openEditProjectModal = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleCreateStage = ({
    name,
    description,
    status,
    icon,
    color,
    sort_order,
  }) => {
    if (currentUserRole !== "OWNER" || !name || !status) return;
    const normalizedName = normalizeStatusName(name);
    if (!normalizedName) return;
    const parsedOrder =
      sort_order === "" || sort_order === undefined || sort_order === null
        ? null
        : Number(sort_order);
    const nextOrder =
      parsedOrder === null ? projectStages.length + 1 : parsedOrder;
    dispatch(
      createStage({
        project_id: selectedProjectId,
        name: normalizedName,
        description: description?.trim() || null,
        status,
        icon: icon || null,
        color: color || null,
        sort_order: Number.isNaN(nextOrder)
          ? projectStages.length + 1
          : nextOrder,
      }),
    ).then((action) => {
      if (action.type.endsWith("fulfilled")) {
        dispatch(fetchStages({ project_id: selectedProjectId }));
      }
    });
  };

  const handleProjectSubmit = ({ name, description, members }) => {
    if (editingProject) {
      dispatch(
        updateProject({
          id: editingProject.project_id,
          data: { name, description },
        }),
      ).then(() => {
        dispatch(fetchUserProjects()).then((res) => {
          const updatedUserProjects = res.payload || [];
          const existingMembers = updatedUserProjects.filter(
            (up) =>
              up.project_id === editingProject.project_id &&
              up.role === "MEMBER",
          );

          existingMembers.forEach((up) => {
            if (!members.includes(up.user_id)) {
              dispatch(
                deleteUserProject({
                  user_id: up.user_id,
                  project_id: editingProject.project_id,
                }),
              );
            }
          });

          members.forEach((user_id) => {
            if (!existingMembers.find((up) => up.user_id === user_id)) {
              dispatch(
                createUserProject({
                  user_id,
                  project_id: editingProject.project_id,
                  role: "MEMBER",
                }),
              );
            }
          });

          Promise.all([
            dispatch(fetchProjects()),
            dispatch(fetchUserProjects()),
            dispatch(fetchStages()),
            dispatch(fetchTasks()),
            dispatch(fetchUserTasks()),
          ]).then(() => {
            setEditingProject(null);
            setSelectedProjectId(editingProject.project_id);
            setModalOpen(false);
          });
        });
      });
    } else {
      dispatch(
        createProject({ name, description, ownerUserId: currentUserId }),
      ).then(async (res) => {
        const created = res.payload;
        if (!created?.project_id) return;
        const project_id = created.project_id;
        const memberPromises = members.map((user_id) =>
          dispatch(createUserProject({ user_id, project_id, role: "MEMBER" })),
        );

        if (memberPromises.length > 0) await Promise.all(memberPromises);

        await Promise.all([
          dispatch(fetchProjects()),
          dispatch(fetchUserProjects()),
          dispatch(fetchStages()),
          dispatch(fetchTasks()),
          dispatch(fetchUserTasks()),
        ]);

        setSelectedProjectId(project_id);
        setModalOpen(false);
      });
    }
  };

  if (loading)
    return (
      <div className="loading-overlay">
        <div className="loading-spinner"></div>
        <span className="loading-text">Loading your projects...</span>
      </div>
    );

  return (
    <div className={`board ${projectRoleClass}`}>
      <header className="board-header">
        <Profile
          profile={profiles.find((p) => p.user_id === currentUserId)}
          onClick={() => {
            handleLogoutConfirm();
          }}
          onUpdate={(profile_id, full_name) =>
            dispatch(updateProfile({ id: profile_id, data: { full_name } }))
          }
        />
        <h1>PlanYU</h1>
        <select
          className="project-select"
          value={selectedProjectId || "add"}
          onChange={(e) => {
            if (e.target.value === "add") {
              setEditingProject(null);
              setModalOpen(true);
            } else {
              const parsed = Number(e.target.value);
              setIsDescriptionExpanded(false);
              setSelectedProjectId(
                Number.isNaN(parsed) ? e.target.value : parsed,
              );
            }
          }}
        >
          {visibleProjects.map((p) => {
            const name = p.name || "";
            const maxLen = isMobile ? 10 : 18;
            const truncated =
              name.length > maxLen ? `${name.slice(0, maxLen - 1)}…` : name;
            return (
              <option key={p.project_id} value={p.project_id} title={name}>
                {truncated}
              </option>
            );
          })}
          <option value="add">+ Add Project</option>
        </select>
      </header>

      {modalOpen && (
        <Form
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleProjectSubmit}
          users={users}
          profiles={profiles}
          currentUserId={currentUserId}
          existingMembers={
            editingProject ? projectMembers.map((m) => m.user_id) : []
          }
          project={editingProject}
        />
      )}

      {!modalOpen && selectedProject && (
        <>
          <section className={`project-info ${projectRoleClass}`}>
            <div className="project-info-header">
              <div className="project-description">
                <span
                  ref={descriptionRef}
                  className={isDescriptionExpanded ? "expanded" : ""}
                >
                  {projectDescription}
                </span>
                {showMoreDescription && (
                  <button
                    type="button"
                    className="show-more"
                    onClick={() => setIsDescriptionExpanded((prev) => !prev)}
                  >
                    {isDescriptionExpanded ? "Show less" : "Show more"}
                  </button>
                )}
              </div>
              <div className="project-members">
                {projectMembers.slice(0, 5).map((m) => (
                  <div
                    key={m.user_id}
                    className={`member-avatar-wrapper ${memberFilterUserIds.includes(m.user_id) ? "active-filter" : ""}`}
                    title={m.full_name}
                    onClick={() =>
                      setMemberFilterUserIds((prev) =>
                        prev.includes(m.user_id)
                          ? prev.filter((id) => id !== m.user_id)
                          : [...prev, m.user_id],
                      )
                    }
                  >
                    <img
                      className="member-avatar"
                      src={m.avatar_url}
                      alt={m.full_name}
                    />
                  </div>
                ))}
                {projectMembers.length > 5 && (
                  <div
                    className="member-avatar-wrapper more-count"
                    title={projectMembers
                      .slice(5)
                      .map((m) => m.full_name)
                      .filter(Boolean)
                      .join(", ")}
                  >
                    +{projectMembers.length - 5}
                  </div>
                )}
              </div>
              {currentUserRole === "OWNER" && (
                <>
                  <div className="project-actions">
                    <button
                      className="edit-btn"
                      onClick={() => openEditProjectModal(selectedProject)}
                    >
                      ✏️
                    </button>
                    <button
                      className="delete"
                      onClick={handleDeleteProjectConfirm}
                    >
                      🗑
                    </button>
                  </div>
                </>
              )}
            </div>
          </section>

          {currentUserRole === "OWNER" && (
            <section className="board-columns-add">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  handleCreateStage({
                    name: fd.get("name")?.toString() || "",
                    description: fd.get("description")?.toString() || "",
                    status: fd.get("status")?.toString() || "TODO",
                    icon: fd.get("icon")?.toString() || "",
                    color: fd.get("color")?.toString() || "",
                    sort_order: fd.get("sort_order")?.toString() || "",
                  });
                  e.target.reset();
                }}
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Stage name"
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Stage description"
                />
                <select name="status" defaultValue="" required>
                  <option value="" disabled>
                    Status
                  </option>
                  <option value="TODO">To Do</option>
                  <option value="DOING">In Progress</option>
                  <option value="REVIEW">Review</option>
                  <option value="DONE">Done</option>
                </select>
                <input type="text" name="icon" placeholder="Stage icon" />
                <input type="color" name="color" defaultValue="#4a4a4a" />
                <input
                  type="number"
                  name="sort_order"
                  placeholder="Stage order"
                />
                <button type="submit">Add Stage</button>
              </form>
            </section>
          )}

          {currentUserRole === "OWNER" && (
            <section className="board-add">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  handleCreateTask({
                    title: fd.get("title")?.toString() || "",
                    description: fd.get("description")?.toString() || "",
                    priority: fd.get("priority")?.toString() || "",
                    due_date: fd.get("due_date")?.toString() || null,
                  });
                  e.target.reset();
                }}
              >
                <input
                  type="text"
                  name="title"
                  placeholder="Task title"
                  required
                />
                <input
                  type="text"
                  name="description"
                  placeholder="Task description"
                />
                <select name="priority" defaultValue="" required>
                  <option value="" disabled>
                    Priority
                  </option>
                  <option value="LOW">Low</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HIGH">High</option>
                </select>
                <input
                  name="due_date"
                  type="date"
                  defaultValue={new Date().toISOString().slice(0, 10)}
                />
                <button type="submit">Add Task</button>
              </form>
            </section>
          )}

          <main className="board-main">
            <div className="columns">
              {projectStages.map((column) => (
                <Column
                  key={column.stage_id}
                  column={column}
                  columns={projectStages}
                  tasks={projectTasks.filter(
                    (task) => task.stage_id === column.stage_id,
                  )}
                  onDrop={handleDrop}
                  onUpdateTask={handleUpdateTask}
                  onDeleteTask={handleDeleteTaskConfirm}
                  onDragStart={(e, id) =>
                    e.dataTransfer.setData("text/plain", id)
                  }
                  readOnly={currentUserRole !== "OWNER"}
                  canChangeStatus={
                    currentUserRole === "OWNER" || currentUserRole === "MEMBER"
                  }
                  projectMembers={projectMembers}
                  profiles={profiles}
                  userTasks={userTasks}
                  canManage={currentUserRole === "OWNER"}
                  onUpdateColumn={handleUpdateStage}
                  onDeleteColumn={handleDeleteStageConfirm}
                />
              ))}
            </div>
          </main>
        </>
      )}

      <Modal
        isOpen={confirmOpen}
        title="Confirmation"
        message={confirmMessage}
        onConfirm={confirmAction}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
}
