import { useState, useEffect } from "react";

export default function Form({
  isOpen,
  onClose,
  onSubmit,
  users,
  existingMembers = [],
  project,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [members, setMembers] = useState([]);
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (project) {
      setTitle(project.name);
      setDescription(project.description || "");
      setMembers(existingMembers);
    } else {
      setTitle("");
      setDescription("");
      setMembers([]);
    }
    setEmailInput("");
    setInvalid(false);
  }, [project, existingMembers]);

  if (!isOpen) return null;

  const addEmail = () => {
    const email = emailInput.trim();
    if (!email) return;

    const user = users.find((u) => u.email === email);
    if (!user) {
      setInvalid(true);
      setTimeout(() => setInvalid(false), 2500);
    } else if (!members.includes(user.user_id)) {
      setMembers((prev) => [...prev, user.user_id]);
    }

    setEmailInput("");
  };

  const removeMember = (id) =>
    setMembers((prev) => prev.filter((x) => x !== id));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      name: title.trim(),
      description: description.trim(),
      members,
    });
    onClose();
  };

  return (
    <section className="form inline-form">
      <form onSubmit={handleSubmit} className="form-content">
        <h2>{project ? "Edit Project" : "Create Project"}</h2>

        <label>Title</label>
        <input
          type="text"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label>Add Members</label>
        <div className="form-members">
          <input
            type="email"
            placeholder="Enter email and press Enter"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addEmail();
              }
            }}
          />
          <div className="emails">
            {members.map((id) => {
              const u = users.find((u) => u.user_id === id);
              return (
                <span key={id} onClick={() => removeMember(id)}>
                  {u?.email}
                </span>
              );
            })}
          </div>
          {invalid && (
            <div className="invalid">There’s no user with this email</div>
          )}
        </div>

        <div className="form-buttons">
          <button className="btn primary" type="submit">
            {project ? "Update Project" : "Add Project"}
          </button>
          <button className="btn secondary" type="button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </form>
    </section>
  );
}
