export default function StatCard({ label, value, accent }) {
  return (
    <div className="nori-card" style={{ padding: 22 }}>
      <div style={{ fontSize: '0.82rem', color: 'var(--nori-coffee-mid)', fontWeight: 600, marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600, color: accent || 'var(--nori-coffee-deep)' }}>
        {value}
      </div>
    </div>
  );
}
