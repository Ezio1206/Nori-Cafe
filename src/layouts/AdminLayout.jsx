import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import logo from '../assets/logo.png';
// Reuses the hamburger/X icon animation defined for the customer Navbar.
import '../components/common/Navbar.css';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the admin navigates to a new page.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="admin-shell">
      {/* Mobile-only top bar with hamburger toggle for the sidebar drawer */}
      <div className="admin-topbar">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img src={logo} alt="Nori Coffee logo" style={{ height: 30, width: 30, borderRadius: 7, objectFit: 'contain' }} />
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, color: 'var(--nori-coffee-deep)' }}>
            Nori Coffee Admin
          </span>
        </div>
        <button
          type="button"
          className="admin-topbar-toggle"
          aria-label={sidebarOpen ? 'Close admin menu' : 'Open admin menu'}
          aria-expanded={sidebarOpen}
          aria-controls="admin-sidebar-drawer"
          onClick={() => setSidebarOpen((v) => !v)}
        >
          <span className={`navbar-toggle-icon${sidebarOpen ? ' is-open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {sidebarOpen && (
        <div className="admin-sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      <div id="admin-sidebar-drawer">
        <AdminSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      </div>

      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
