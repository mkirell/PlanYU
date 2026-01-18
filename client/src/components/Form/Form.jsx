import { useReducer, useEffect, useState } from "react";
import Chip from "../Chip/Chip.jsx";
import "./Form.css";

export default function Form({
  isOpen,
  onClose,
  onSubmit,
  users,
  existingMembers = [],
  project,
  currentUserId,
  profiles = [],
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
  const [pendingAddMembers, setPendingAddMembers] = useState([]);
  const [pendingRemoveMembers, setPendingRemoveMembers] = useState([]);

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
    Promise.resolve().then(() => {
      setPendingAddMembers([]);
      setPendingRemoveMembers([]);
    });
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
        2500,
      );
    } else if (user.user_id === currentUserId) {
      setOwnerSelf(true);
      setTimeout(() => setOwnerSelf(false), 2500);
    } else if (
      !members.includes(user.user_id) &&
      !pendingAddMembers.includes(user.user_id)
    ) {
      setPendingAddMembers((prev) => [...prev, user.user_id]);
    }
    dispatchForm({ type: "setField", field: "emailInput", value: "" });
  };

  const removeMember = (id) => {
    // if this is a newly added pending member, remove from pendingAdd
    if (pendingAddMembers.includes(id)) {
      setPendingAddMembers((prev) => prev.filter((x) => x !== id));
      return;
    }
    // toggle pending remove for existing members
    setPendingRemoveMembers((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title) return;
    // compute final members: remove pending removals, add pending additions
    const finalMembers = Array.from(
      new Set([
        ...members.filter((id) => !pendingRemoveMembers.includes(id)),
        ...pendingAddMembers.filter((id) => !pendingRemoveMembers.includes(id)),
      ]),
    );

    onSubmit({
      name: title,
      description: description,
      members: finalMembers,
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
              const prof = profiles.find((p) => p.user_id === id) || {};
              const removing = pendingRemoveMembers.includes(id);
              return (
                <Chip
                  key={id}
                  id={id}
                  profile={prof}
                  removing={removing}
                  onClick={() => removeMember(id)}
                />
              );
            })}

            {pendingAddMembers.map((id) => {
              const prof = profiles.find((p) => p.user_id === id) || {};
              return (
                <Chip
                  key={`pending-${id}`}
                  id={id}
                  profile={prof}
                  pending
                  onClick={() => removeMember(id)}
                />
              );
            })}
          </div>
          {invalid && (
            <div className="invalid">There is no user with this email</div>
          )}
          {ownerSelf && (
            <div className="invalid">You are already the project owner</div>
          )}
          {pendingRemoveMembers.includes(currentUserId) && (
            <div className="invalid">
              You (project owner) will be removed on submit
            </div>
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
