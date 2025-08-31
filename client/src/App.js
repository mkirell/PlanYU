import { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Container, Row, Col, Button, Spinner, Alert } from "react-bootstrap";
import { Tasks } from "./apis/tasks.api";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Modal from "./components/Modal";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showRemoveAllModal, setShowRemoveAllModal] = useState(false);

  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getInitialTheme);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      const data = await Tasks.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    document.body.setAttribute("data-bs-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  async function handleAdd(values) {
    await Tasks.add(values);
    await refresh();
  }

  async function handleUpdate(id, values) {
    await Tasks.update(id, values);
    await refresh();
  }

  async function handleRemove(id) {
    await Tasks.remove(id);
    await refresh();
  }

  async function handleRemoveAll() {
    await Tasks.removeAll();
    await refresh();
    setShowRemoveAllModal(false);
  }

  return (
    <Container className="my-4">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center px-2">
            <h1 className="fw-bold mb-0 rounded-4 shadow-sm py-2">✅ Tasks</h1>
            <Button
              variant={theme === "light" ? "dark" : "light"}
              className="rounded-pill px-3"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              {theme === "light" ? "🌙 Dark" : "☀ Light"}
            </Button>
          </div>
        </Col>
      </Row>

      {error && (
        <Row className="mb-3">
          <Col>
            <Alert
              variant="danger"
              dismissible
              onClose={() => setError(null)}
              className="rounded-3 shadow-sm"
            >
              {error}
            </Alert>
          </Col>
        </Row>
      )}

      <Row className="mb-4">
        <Col>
          <TaskForm onSubmit={handleAdd} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col className="d-flex gap-2">
          <Button
            variant="primary"
            onClick={refresh}
            disabled={loading}
            className="rounded-pill d-flex align-items-center gap-2"
          >
            {loading ? (
              <>
                <Spinner size="sm" animation="border" role="status" />
                Loading...
              </>
            ) : (
              <>
                <i className="bi bi-arrow-clockwise"></i> Refresh
              </>
            )}
          </Button>

          <Button
            variant="danger"
            onClick={() => setShowRemoveAllModal(true)}
            className="rounded-pill d-flex align-items-center gap-2"
          >
            <i className="bi bi-trash"></i> Delete All
          </Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <TaskList
            tasks={tasks}
            onUpdate={handleUpdate}
            onRemove={handleRemove}
          />
        </Col>
      </Row>

      <Modal
        show={showRemoveAllModal}
        onClose={() => setShowRemoveAllModal(false)}
        onConfirm={handleRemoveAll}
        title="Confirm Delete All"
        body="⚠ Are you sure you want to delete all tasks?"
        confirmText="Delete All"
      />
    </Container>
  );
}
