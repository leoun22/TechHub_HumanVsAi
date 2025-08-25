import "./start.css";

type StartProps = {
  label?: string; // button text
  onClick?: () => void; // click handler
  loading?: boolean; // optional loading state
  className?: string; // extra classes/styles from parent
};

export default function Start({
  label = "START",
  onClick,
  loading = false,
  className = "",
}: StartProps) {
  return (
    <button
      className={`start-btn ${className} ${loading ? "is-loading" : ""}`}
      onClick={onClick}
      disabled={loading}
      aria-busy={loading}
    >
      {loading ? "Loading…" : label}
    </button>
  );
}
