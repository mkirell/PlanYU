import { useState } from "react";
import {
  Card,
  Button,
  Form,
  Badge,
  Collapse,
  ListGroup,
} from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";

function TaskRow({ task, onUpdate, onRemove }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(task.name);
  const [description, setDescription] = useState(task.description || "");
  const [done, setDone] = useState(!!task.done);

  async function save() {
    await onUpdate(task._id, { name, description, done });
    setEditing(false);
  }

  return (
    <Card className="mb-4 shadow-lg border-0 rounded-4 hover-shadow transition-all">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <Card.Title className="fw-bold mb-1">
              {task.name}{" "}
              {done && (
                <Badge
                  bg="success"
                  className="px-2 py-1 rounded-pill shadow-sm mx-1"
                >
                  ✔ Done
                </Badge>
              )}
            </Card.Title>
            {description && (
              <Card.Text className="text-muted small">{description}</Card.Text>
            )}
          </div>
          <div className="d-flex gap-2">
            <Button
              size="sm"
              variant="outline-primary"
              className="rounded-pill d-flex align-items-center gap-1"
              onClick={() => setEditing(!editing)}
            >
              <i className="bi bi-pencil"></i> {editing ? "Close" : "Edit"}
            </Button>

            <Button
              size="sm"
              variant="outline-danger"
              className="rounded-pill d-flex align-items-center gap-1"
              onClick={() => onRemove(task._id)}
            >
              <i className="bi bi-trash"></i> Delete
            </Button>
          </div>
        </div>

        <Collapse in={editing}>
          <div className="mt-3">
            <Form.Control
              className="mb-2 rounded-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control
              className="mb-2 rounded-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <Form.Check
              className="mb-2"
              type="checkbox"
              label="Mark as Done"
              checked={done}
              onChange={(e) => setDone(e.target.checked)}
            />
            <div className="d-flex gap-2">
              <Button
                size="sm"
                onClick={save}
                variant="success"
                className="rounded-pill d-flex align-items-center gap-1"
              >
                <i className="bi bi-check2-circle"></i> Save
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="rounded-pill d-flex align-items-center gap-1"
                onClick={() => setEditing(false)}
              >
                <i className="bi bi-x-circle"></i> Cancel
              </Button>
            </div>
          </div>
        </Collapse>
      </Card.Body>
      <Card.Footer className="text-muted small rounded-bottom-4">
        Added: {new Date(task.createdAt).toLocaleString()}
      </Card.Footer>
    </Card>
  );
}

export default function TaskList({ tasks, onUpdate, onRemove }) {
  if (!tasks.length)
    return (
      <p className="text-muted fst-italic">
        ✨ No tasks yet. Add your first one!
      </p>
    );

  return (
    <ListGroup variant="flush">
      {tasks.map((task) => (
        <ListGroup.Item key={task._id} className="p-0 border-0">
          <TaskRow task={task} onUpdate={onUpdate} onRemove={onRemove} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
}
