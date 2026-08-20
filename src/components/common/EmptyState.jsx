export default function EmptyState({ title, message, action }) {
  return (
    <div className="nori-empty">
      <h3 style={{ marginBottom: 8 }}>{title}</h3>
      {message && <p style={{ margin: '0 0 16px', color: 'var(--nori-coffee-mid)' }}>{message}</p>}
      {action}
    </div>
  );
}
