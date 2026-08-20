export default function ConfirmDialog({ open, title, message, confirmLabel = 'Confirm', onConfirm, onCancel, danger = true }) {
  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, background: 'rgba(36, 22, 16, 0.45)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
      }}
      onClick={onCancel}
    >
      <div
        className="nori-card"
        style={{ maxWidth: 400, width: '100%', padding: 28 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: '1.2rem', marginBottom: 10 }}>{title}</h3>
        <p style={{ color: 'var(--nori-coffee-mid)', marginBottom: 22, fontSize: '0.92rem' }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button className="nori-btn nori-btn-secondary" onClick={onCancel}>Cancel</button>
          <button className={`nori-btn ${danger ? 'nori-btn-danger' : 'nori-btn-primary'}`} onClick={onConfirm}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
