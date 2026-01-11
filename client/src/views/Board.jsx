import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Card from "../components/Card";
import Profile from "../components/Profile";
import Form from "../components/Form";
import Modal from "../components/Modal";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../redux/slices/projectSlice";
import {
  fetchTasks,
  createTask,
  updateTask,
  deleteTask,
} from "../redux/slices/taskSlice";
import { fetchUsers } from "../redux/slices/userSlice";
import { logoutUser } from "../redux/slices/authSlice";
import { fetchProfiles } from "../redux/slices/profileSlice";
import {
  fetchUserProjects,
  createUserProject,
  deleteUserProject,
} from "../redux/slices/userProjectSlice";

export default function Board({ currentUserId, onLogout }) {
  const dispatch = useDispatch();
  const projects = useSelector((state) => state.projects.list);
  const tasks = useSelector((state) => state.tasks.list);
  const users = useSelector((state) => state.users.list);
  const profiles = useSelector((state) => state.profiles.list);
  const userProjects = useSelector((state) => state.userProjects.list);

  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [loading, setLoading] = useState(true);
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
            (up.role === "OWNER" || up.role === "MEMBER")
        )
        .reduce((acc, up) => {
          acc[up.project_id] = up.role;
          return acc;
        }, {}),
    [userProjects, currentUserId]
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
    [projects, userProjectRoles]
  );

  useEffect(() => {
    Promise.all([
      dispatch(fetchProjects()),
      dispatch(fetchTasks()),
      dispatch(fetchUsers()),
      dispatch(fetchProfiles()),
      dispatch(fetchUserProjects()),
    ]).finally(() => setLoading(false));
  }, [dispatch]);

  useEffect(() => {
    if (!loading) {
      if (!selectedProjectId && visibleProjects.length > 0) {
        setTimeout(() =>
          setSelectedProjectId(visibleProjects[0].project_id),
          0
        );
      } else if (visibleProjects.length === 0) {
        setTimeout(() => setModalOpen(true), 0);
      }
    }
  }, [loading, visibleProjects, selectedProjectId]);

  const selectedProject = useMemo(
    () => visibleProjects.find((p) => p.project_id === selectedProjectId),
    [visibleProjects, selectedProjectId]
  );

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.project_id === selectedProjectId),
    [tasks, selectedProjectId]
  );

  const projectMembers = useMemo(
    () =>
      userProjects
        .filter(
          (up) => up.project_id === selectedProjectId && up.role === "MEMBER"
        )
        .map((up) => profiles.find((p) => p.user_id === up.user_id))
        .filter(Boolean),
    [selectedProjectId, userProjects, profiles]
  );

  const currentUserRole = useMemo(
    () => userProjectRoles[selectedProjectId] || "MEMBER",
    [selectedProjectId, userProjectRoles]
  );

  const projectRoleClass = currentUserRole === "OWNER" ? "owner" : "member";

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
      })
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
          deleteUserProject({ user_id: up.user_id, project_id: up.project_id })
        )
      );
    const remainingProjects = visibleProjects.filter(
      (p) => p.project_id !== deletedProjectId
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
        })
      ).then(() => {
        const existingMembers = userProjects.filter(
          (up) =>
            up.project_id === editingProject.project_id && up.role === "MEMBER"
        );
        existingMembers.forEach((up) => {
          if (!members.includes(up.user_id)) {
            dispatch(
              deleteUserProject({
                user_id: up.user_id,
                project_id: editingProject.project_id,
              })
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
              })
            );
          }
        });
        setEditingProject(null);
        setSelectedProjectId(editingProject.project_id);
        setModalOpen(false);
      });
    } else {
      dispatch(createProject({ name, description })).then((res) => {
        const project_id = res.payload.project_id;
        dispatch(
          createUserProject({
            user_id: currentUserId,
            project_id,
            role: "OWNER",
          })
        );
        members.forEach((user_id) =>
          dispatch(createUserProject({ user_id, project_id, role: "MEMBER" }))
        );
        dispatch(fetchProjects()).then(() => {
          setSelectedProjectId(project_id);
          setModalOpen(false);
        });
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
        />
        <h1>PlanYU</h1>
        <select
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
              {currentUserRole === "OWNER" && (
                <>
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
                </>
              )}
              <div className="project-members">
                {projectMembers.map((m) => (
                  <div
                    key={m.user_id}
                    className="member-avatar-wrapper"
                    title={m.full_name}
                  >
                    <img
                      className="member-avatar"
                      src={m.avatar_url}
                      alt={m.full_name}
                    />
                  </div>
                ))}
              </div>
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
