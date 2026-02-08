import { useEffect, useState, useRef } from "react";
import "./Notif.css";
import { useSelector } from "react-redux";

function Push({ id, type, message, onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(t);
  }, [id, onClose]);

  return (
    <div className={`pyu-notification pyu-${type || "info"}`}>
      <div className="pyu-notification-message">{message}</div>
      <button
        className="pyu-notification-close"
        onClick={() => onClose(id)}
        aria-label="close notification"
      >
        ×
      </button>
    </div>
  );
}

export default function Notif() {
  const [items, setItems] = useState([]);
  const remove = (id) => setItems((s) => s.filter((it) => it.id !== id));

  const auth = useSelector((s) => s.auth);
  const users = useSelector((s) => s.users);
  const profiles = useSelector((s) => s.profiles);
  const projects = useSelector((s) => s.projects);
  const tasks = useSelector((s) => s.tasks);
  const userProjects = useSelector((s) => s.userProjects);
  const userTasks = useSelector((s) => s.userTasks);

  const prevMessages = useRef({
    auth: auth?.message,
    users: users?.message,
    profiles: profiles?.message,
    projects: projects?.message,
    tasks: tasks?.message,
    userProjects: userProjects?.message,
    userTasks: userTasks?.message,
  });

  useEffect(() => {
    const handler = (e) => {
      const { message, type = "info", duration } = e.detail || {};
      if (!message) return;
      const id = Date.now() + Math.random();
      setItems((s) => {
        const arr = [...s, { id, message, type, duration }];
        return arr.slice(-3);
      });
      if (duration && duration > 0) {
        setTimeout(() => remove(id), duration);
      }
    };

    window.addEventListener("show-notification", handler);
    return () => window.removeEventListener("show-notification", handler);
  }, []);

  useEffect(() => {
    const newNotifs = [];

    const checkMessage = (sliceName, slice) => {
      if (!slice) return;
      const prev = prevMessages.current[sliceName];
      const cur = slice.message;
      if (prev === cur) return;
      if (cur) {
        const type = slice.status === "failed" ? "error" : "success";
        newNotifs.push({ id: Date.now() + Math.random(), message: cur, type });
      }
      prevMessages.current[sliceName] = cur;
    };

    checkMessage("users", users);
    checkMessage("profiles", profiles);
    checkMessage("projects", projects);
    checkMessage("tasks", tasks);
    checkMessage("userProjects", userProjects);
    checkMessage("userTasks", userTasks);

    if (newNotifs.length) {
      setTimeout(
        () =>
          setItems((s) => {
            const arr = [...s, ...newNotifs];
            return arr.slice(-3);
          }),
        0,
      );
    }
  }, [users, profiles, projects, tasks, userProjects, userTasks]);
  if (!items.length) return null;

  return (
    <div className="pyu-notification-root" role="status" aria-live="polite">
      {items.map((it) => (
        <Push key={it.id} {...it} onClose={remove} />
      ))}
    </div>
  );
}
