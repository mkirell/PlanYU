import { useReducer, useEffect, useState } from "react";

export default function Form({
  isOpen,
  onClose,
  onSubmit,
  users,
  existingMembers = [],
  project,
  currentUserId,
}) {
  function formReducer(state, action) {
    switch (action.type) {
      case "reset":
        return action.payload;
      case "setField":
        return { ...state, [action.field]: action.value };
      case "addMember":
        return { ...state, members: [...state.members, action.value] };
      case "removeMember":
        return {
          ...state,
          members: state.members.filter((x) => x !== action.value),
        };
      case "setInvalid":
        return { ...state, invalid: action.value };
      default:
        return state;
    }
  }
  const [formState, dispatchForm] = useReducer(formReducer, {
    title: "",
    description: "",
    emailInput: "",
    members: [],
    invalid: false,
  });
  const { title, description, emailInput, members, invalid } = formState;
  const [ownerSelf, setOwnerSelf] = useState(false);

  useEffect(() => {
    if (project) {
      dispatchForm({
        type: "reset",
        payload: {
          title: project.name ? project.name : "",
          description: project.description ? project.description : "",
          emailInput: "",
          members: existingMembers,
          invalid: false,
        },
      });
    } else {
      dispatchForm({
        type: "reset",
        payload: {
          title: "",
          description: "",
          emailInput: "",
          members: [],
          invalid: false,
        },
      });
    }
  }, [project, existingMembers]);

  if (!isOpen) return null;

  const addEmail = () => {
    const email = emailInput;
    if (!email) return;
    const user = users.find((u) => u.email === email);
    if (!user) {
      dispatchForm({ type: "setInvalid", value: true });
      setTimeout(
        () => dispatchForm({ type: "setInvalid", value: false }),
        2500
      );
    } else if (user.user_id === currentUserId) {
      setOwnerSelf(true);
      setTimeout(() => setOwnerSelf(false), 2500);
    } else if (!members.includes(user.user_id)) {
      dispatchForm({ type: "addMember", value: user.user_id });
    }
    dispatchForm({ type: "setField", field: "emailInput", value: "" });
  };

  const removeMember = (id) =>
    dispatchForm({ type: "removeMember", value: id });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    onSubmit({
      name: title,
      description: description,
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
          onChange={(e) =>
            dispatchForm({
              type: "setField",
              field: "title",
              value: e.target.value,
            })
          }
          required
        />

        <label>Description</label>
        <textarea
          placeholder="Project Description"
          value={description}
          onChange={(e) =>
            dispatchForm({
              type: "setField",
              field: "description",
              value: e.target.value,
            })
          }
        />

        <label>Add Members</label>
        <div className="form-members">
          <input
            type="email"
            placeholder="Enter email and press Enter"
            value={emailInput}
            onChange={(e) =>
              dispatchForm({
                type: "setField",
                field: "emailInput",
                value: e.target.value,
              })
            }
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
            <div className="invalid">There is no user with this email</div>
          )}
          {ownerSelf && (
            <div className="invalid">You are already the project owner</div>
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
