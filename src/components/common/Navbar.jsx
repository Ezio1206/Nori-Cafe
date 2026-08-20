import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import logo from '../../assets/logo.png';
import './Navbar.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/history', label: 'History' },
];

export default function Navbar() {
  const { itemCount } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // Close the mobile menu whenever the route changes (e.g. after selecting a link)
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Close the mobile menu automatically if the viewport is resized up to desktop/tablet
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeMenu = () => setMenuOpen(false);
  const toggleMenu = () => setMenuOpen((open) => !open);

  return (
    <header
      style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--nori-cream-soft)',
        borderBottom: '1px solid var(--nori-border)',
      }}
    >
      <div className="container navbar-inner" style={{ position: 'relative' }}>
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <img src={logo} alt="Nori Coffee logo" className="navbar-logo" />
          <span className="navbar-brand-name">Nori Coffee</span>
        </Link>

        <button
          type="button"
          className="navbar-toggle"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          aria-controls="navbar-nav-panel"
          onClick={toggleMenu}
        >
          <span className={`navbar-toggle-icon${menuOpen ? ' is-open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>

        <nav
          id="navbar-nav-panel"
          className={`navbar-nav${menuOpen ? ' is-open' : ''}`}
        >
          <div className="navbar-links">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                onClick={closeMenu}
                className={({ isActive }) => `navbar-link${isActive ? ' is-active' : ''}`}
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink to="/cart" aria-label="Cart" className="navbar-cart" onClick={closeMenu}>
              <CartIcon />
              <span className="navbar-cart-label">Cart</span>
              {itemCount > 0 && (
                <span className="navbar-cart-badge">{itemCount}</span>
              )}
            </NavLink>
          </div>

          <div className="navbar-account-wrap">
            <NavLink
              to={user ? '/account' : '/login'}
              className="nori-btn nori-btn-primary navbar-account-btn"
              onClick={closeMenu}
            >
              {user ? 'Account' : 'Sign In'}
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
}

function CartIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--nori-coffee)" strokeWidth="1.8">
      <circle cx="9" cy="21" r="1.4" fill="var(--nori-coffee)" stroke="none" />
      <circle cx="18" cy="21" r="1.4" fill="var(--nori-coffee)" stroke="none" />
      <path d="M2 3h2l2.6 12.4a2 2 0 0 0 2 1.6h8a2 2 0 0 0 2-1.6L21 7H6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
