import { useEffect, useRef, useState } from "react";
import "./Profile.css";

export default function Profile({ profile, onClick, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  if (!profile) return null;

  const startEdit = (e) => {
    e.stopPropagation();
    setValue(profile?.full_name || "");
    setEditing(true);
  };

  const cancelEdit = () => {
    setValue("");
    setEditing(false);
  };

  const saveEdit = async () => {
    const trimmed = (value || "").trim();
    if (trimmed === (profile.full_name || "") || !profile.profile_id) {
      setEditing(false);
      return;
    }
    if (typeof onUpdate === "function") {
      await onUpdate(profile.profile_id, trimmed);
    }
    setEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <div className="profile-card">
      <div className="avatar-wrapper" onClick={onClick}>
        <img
          className="profile-avatar"
          src={profile.avatar_url}
          alt={profile.full_name}
        />
        <div className="logout-overlay">🔒</div>
      </div>

      <div className="profile-info">
        <div className="profile-name">
          {editing ? (
            <input
              ref={inputRef}
              className="card-title-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={onKeyDown}
              onBlur={saveEdit}
            />
          ) : (
            <>
              <span>{profile.full_name}</span>
              <button
                className="profile-edit-btn"
                onClick={startEdit}
                title="Edit name"
                aria-label="Edit full name"
              >
                ✎
              </button>
            </>
          )}
        </div>
        <div className="profile-id">ID: {profile.user_id}</div>
      </div>
    </div>
  );
}
