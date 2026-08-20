import { Link, Outlet } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function AuthLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--nori-cream)', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>
        <Link to="/" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <img src={logo} alt="Nori Coffee logo" style={{ height: 64, width: 64, objectFit: 'contain', borderRadius: 14 }} />
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 600, color: 'var(--nori-coffee-deep)' }}>
            Nori Coffee
          </span>
        </Link>
        <div className="nori-card" style={{ padding: 32 }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
