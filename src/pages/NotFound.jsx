import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: 24 }}>
      <span className="nori-eyebrow">Lost your way?</span>
      <h1 style={{ fontSize: '2rem', marginBottom: 10 }}>Page not found</h1>
      <p style={{ color: 'var(--nori-coffee-mid)', marginBottom: 20 }}>We couldn't find what you were looking for.</p>
      <Link to="/" className="nori-btn nori-btn-primary">Back to Home</Link>
    </div>
  );
}
