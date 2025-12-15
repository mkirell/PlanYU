export default function Profile({ profile, onClick }) {
  if (!profile) return null;

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
        <div className="profile-name">{profile.full_name}</div>
        <div className="profile-id">ID: {profile.user_id}</div>
      </div>
    </div>
  );
}
