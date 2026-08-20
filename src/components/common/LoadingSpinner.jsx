export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 48 }}>
      <div className="nori-spinner" />
      <span style={{ color: 'var(--nori-coffee-mid)', fontSize: '0.9rem' }}>{label}</span>
    </div>
  );
}
