import { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";

export default function TaskForm({ onSubmit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  function reset() {
    setName("");
    setDescription("");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    await onSubmit({ name: name.trim(), description: description.trim() });
    reset();
  }

  return (
    <Card className="shadow-lg border-0 rounded-4 bg-body-tertiary bg-opacity-75 backdrop-blur">
      <Card.Body>
        <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3">
          <Form.Control
            type="text"
            placeholder="✨ Enter task name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-3"
          />
          <Form.Control
            type="text"
            placeholder="📝 Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="rounded-3"
          />
          <div className="d-grid">
            <Button
              type="submit"
              className="btn btn-success bg-gradient rounded-3 shadow-sm d-flex justify-content-center align-items-center gap-2"
            >
              <i className="bi bi-plus-lg"></i> Add Task
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}
