import "./Chip.css";

export default function Chip({
  id,
  profile = {},
  label,
  pending,
  removing,
  onClick,
}) {
  const className =
    `chip assignment-chip ${pending ? "pending" : ""} ${removing ? "removing" : ""}`.trim();
  return (
    <div
      className={className}
      onClick={onClick}
      title={profile.full_name || String(id)}
    >
      {profile.avatar_url && (
        <img src={profile.avatar_url} alt={profile.full_name} />
      )}
      <span>{label || profile.full_name || id}</span>
    </div>
  );
}
