import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "../../components/Card/Card.jsx";
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
import { fetchUserTasks } from "../../features/userTasks/userTaskThunks";
import { fetchUsers } from "../../features/users/userThunks";
import { logoutUser } from "../../features/auth/authSlice";
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
  const tasks = useSelector((state) => state.tasks.list);
  const userTasks = useSelector((state) => state.usertasks.list);
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

  const STATUS = [
    { key: "TODO", label: "To Do" },
    { key: "DOING", label: "In Progress" },
    { key: "DONE", label: "Done" },
  ];

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
    Promise.all([
      dispatch(fetchProjects()),
      dispatch(fetchTasks()),
      dispatch(fetchUserTasks()),
      dispatch(fetchUsers()),
      dispatch(fetchProfiles()),
      dispatch(fetchUserProjects()),
    ]).finally(() => setLoading(false));
  }, [dispatch]);

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

  const handleUpdateTask = (task_id, patch) =>
    dispatch(updateTask({ id: task_id, data: patch }));

  const handleDeleteTask = (task_id) => dispatch(deleteTask(task_id));

  const handleCreateTask = ({
    title,
    description = "",
    difficulty = "MEDIUM",
    due_date = null,
  }) => {
    if (currentUserRole !== "OWNER" || !title) return;
    dispatch(
      createTask({
        project_id: selectedProjectId,
        title,
        description,
        status: "TODO",
        difficulty,
        due_date: due_date
          ? new Date(due_date).toISOString()
          : new Date().toISOString(),
      }),
    );
  };

  const handleDrop = (e, status) => {
    const id = Number(e.dataTransfer.getData("text/plain"));
    if (!id) return;
    handleUpdateTask(id, { status });
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

  const removeProject = () => {
    if (!selectedProject || currentUserRole !== "OWNER") return;
    const deletedProjectId = selectedProject.project_id;
    dispatch(deleteProject(deletedProjectId));
    userProjects
      .filter((up) => up.project_id === deletedProjectId)
      .forEach((up) =>
        dispatch(
          deleteUserProject({ user_id: up.user_id, project_id: up.project_id }),
        ),
      );
    const remainingProjects = visibleProjects.filter(
      (p) => p.project_id !== deletedProjectId,
    );
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

  const handleProjectSubmit = ({ name, description, members }) => {
    if (editingProject) {
      dispatch(
        updateProject({
          id: editingProject.project_id,
          data: { name, description },
        }),
      ).then(() => {
        const existingMembers = userProjects.filter(
          (up) =>
            up.project_id === editingProject.project_id && up.role === "MEMBER",
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
          dispatch(fetchTasks()),
          dispatch(fetchUserTasks()),
        ]).then(() => {
          setEditingProject(null);
          setSelectedProjectId(editingProject.project_id);
          setModalOpen(false);
        });
      });
    } else {
      dispatch(createProject({ name, description })).then(async (res) => {
        const project_id = res.payload.project_id;
        const ownerPromise = dispatch(
          createUserProject({
            user_id: currentUserId,
            project_id,
            role: "OWNER",
          }),
        );
        const memberPromises = members.map((user_id) =>
          dispatch(createUserProject({ user_id, project_id, role: "MEMBER" })),
        );

        await Promise.all([ownerPromise, ...memberPromises]);

        await Promise.all([
          dispatch(fetchProjects()),
          dispatch(fetchUserProjects()),
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
            dispatch(logoutUser());
            onLogout();
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
              setSelectedProjectId(Number(e.target.value));
            }
          }}
        >
          {visibleProjects.map((p) => (
            <option key={p.project_id} value={p.project_id}>
              {p.name}
            </option>
          ))}
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
                <span>{selectedProject.description || "No description"}</span>
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
            <section className="board-add">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const fd = new FormData(e.target);
                  handleCreateTask({
                    title: fd.get("title")?.toString() || "",
                    description: fd.get("description")?.toString() || "",
                    difficulty: fd.get("difficulty")?.toString() || "MEDIUM",
                    due_date: fd.get("due_date")?.toString() || null,
                  });
                  e.target.reset();
                }}
              >
                <input type="text" name="title" placeholder="Title" required />
                <input
                  type="text"
                  name="description"
                  placeholder="Description"
                />
                <select name="difficulty" defaultValue="MEDIUM">
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
                <input name="due_date" type="date" />
                <button type="submit">Add Task</button>
              </form>
            </section>
          )}

          <main className="board-main">
            <div className="columns">
              {STATUS.map((s) => (
                <div
                  key={s.key}
                  className="column"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => handleDrop(e, s.key)}
                >
                  <h2>{s.label}</h2>
                  <div className="list">
                    {projectTasks
                      .filter((t) => t.status === s.key)
                      .map((task) => (
                        <Card
                          key={task.task_id}
                          task={task}
                          onUpdate={handleUpdateTask}
                          onDelete={() => handleDeleteTaskConfirm(task.task_id)}
                          onDragStart={(e, id) =>
                            e.dataTransfer.setData("text/plain", id)
                          }
                          readOnly={currentUserRole !== "OWNER"}
                          canChangeStatus={
                            currentUserRole === "OWNER" ||
                            currentUserRole === "MEMBER"
                          }
                          projectMembers={projectMembers}
                          profiles={profiles}
                          userTasks={userTasks}
                          currentUserId={currentUserId}
                        />
                      ))}
                  </div>
                </div>
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
