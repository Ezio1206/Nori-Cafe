import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/drinks', label: 'Manage Drinks' },
  { to: '/admin/orders', label: 'Manage Orders' },
  { to: '/admin/customers', label: 'Manage Customers' },
  { to: '/admin/account', label: 'Admin Account' },
];

export default function AdminSidebar({ open, onNavigate }) {
  const { logout } = useAuth();

  return (
    <aside className={`admin-sidebar${open ? ' is-open' : ''}`}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36, paddingLeft: 6 }}>
        <img src={logo} alt="Nori Coffee logo" style={{ height: 36, width: 36, borderRadius: 8, objectFit: 'contain', flexShrink: 0 }} />
        <div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600 }}>Nori Coffee</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--nori-tan)' }}>Admin Dashboard</div>
        </div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={onNavigate}
            style={({ isActive }) => ({
              padding: '12px 14px',
              borderRadius: 10,
              fontSize: '0.92rem',
              fontWeight: 600,
              background: isActive ? 'rgba(216, 190, 150, 0.18)' : 'transparent',
              color: isActive ? 'var(--nori-tan)' : 'var(--nori-cream-soft)',
            })}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="nori-btn nori-btn-ghost"
        style={{ color: 'var(--nori-tan)', justifyContent: 'flex-start' }}
      >
        Log out
      </button>
    </aside>
  );
}
