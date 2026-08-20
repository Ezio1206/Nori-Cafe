import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { CONTACT_INFO, SOCIAL_LINKS, SHOP_LOCATION_URL } from '../../config/siteConfig';

// Maps each SOCIAL_LINKS entry (by name) to its icon component below.
const SOCIAL_ICONS = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  Telegram: TelegramIcon,
  GitHub: GitHubIcon,
  YouTube: YouTubeIcon,
};

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* 1. Nori Coffee — logo + tagline (replaces the reference's "V-Store QR") */}
        <div className="footer-col">
          <div className="footer-logo-wrap">
            <img src={logo} alt="Nori Coffee logo" className="footer-logo" />
          </div>
          <p className="footer-tagline">Nori Coffee always welcome you!</p>
        </div>

        {/* 2. Follow Us */}
        <div className="footer-col">
          <h3 className="footer-heading">Follow Us</h3>
          <div className="footer-social-row">
            {SOCIAL_LINKS.map((social) => {
              const Icon = SOCIAL_ICONS[social.name];
              return (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-social-icon"
                  aria-label={`Nori Coffee on ${social.name}`}
                  title={social.name}
                >
                  {Icon && <Icon />}
                </a>
              );
            })}
          </div>
        </div>

        {/* 3. Customer Services */}
        <div className="footer-col">
          <h3 className="footer-heading">Customer Services</h3>
          <ul className="footer-link-list">
            <li>
              <Link to="/privacy-policy" className="footer-link">Privacy Policy</Link>
            </li>
            <li>
              <a href={SHOP_LOCATION_URL} target="_blank" rel="noopener noreferrer" className="footer-link">
                Find a store
              </a>
            </li>
          </ul>
        </div>

        {/* 4. Contact Us */}
        <div className="footer-col">
          <h3 className="footer-heading">Contact Us</h3>
          <ul className="footer-link-list">
            <li>
              <a href={`mailto:${CONTACT_INFO.email}`} className="footer-link footer-contact-link">
                <MailIcon /> {CONTACT_INFO.email}
              </a>
            </li>
            <li>
              <a href={`tel:${CONTACT_INFO.phoneHref}`} className="footer-link footer-contact-link">
                <PhoneIcon /> {CONTACT_INFO.phone}
              </a>
            </li>
            <li>
              <a
                href={CONTACT_INFO.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link footer-contact-link"
              >
                <TelegramIcon small /> {CONTACT_INFO.telegramHandle}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

/* ----------------------------- Icons ----------------------------- */
/* Simple, consistent line/fill icons matching the site's visual style
 * (see CartIcon in Navbar.jsx for the same pattern). Kept local to the
 * footer since they aren't reused elsewhere. */

function FacebookIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.87.24-1.46 1.49-1.46H16.5V4.35C16.24 4.32 15.36 4.25 14.34 4.25c-2.13 0-3.59 1.3-3.59 3.68V10.5H8.25v3h2.5V21z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.8" />
      <circle cx="16.9" cy="7.1" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TelegramIcon({ small }) {
  const size = small ? 15 : 18;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M21.5 4.5 3.2 11.6c-1.1.44-1.1 1.05-.2 1.32l4.68 1.46 1.8 5.5c.22.6.38.84.78.84.32 0 .46-.15.65-.33l1.7-1.66 4.7 3.47c.86.48 1.48.23 1.7-.8l3.06-14.4c.31-1.28-.48-1.86-1.58-1.36zM8.7 14.06l9.3-5.86c.44-.27.84-.12.51.18l-7.98 7.21-.31 3.4z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.48 2 2 6.58 2 12.2c0 4.49 2.87 8.3 6.84 9.64.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.46-1.17-1.11-1.48-1.11-1.48-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.89 1.55 2.34 1.1 2.91.84.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.13-4.56-5.03 0-1.11.38-2.02 1.01-2.73-.1-.26-.44-1.3.1-2.7 0 0 .82-.27 2.7 1.04a9 9 0 0 1 2.46-.34c.83 0 1.67.11 2.46.34 1.88-1.31 2.7-1.04 2.7-1.04.54 1.4.2 2.44.1 2.7.63.71 1.01 1.62 1.01 2.73 0 3.91-2.34 4.77-4.57 5.02.36.32.68.94.68 1.9 0 1.37-.01 2.47-.01 2.81 0 .27.18.6.69.49A10.01 10.01 0 0 0 22 12.2C22 6.58 17.52 2 12 2" />
    </svg>
  );
}

function YouTubeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12s0-3.06-.39-4.53a2.94 2.94 0 0 0-2.07-2.08C17.97 5 12 5 12 5s-5.97 0-7.54.4a2.94 2.94 0 0 0-2.07 2.07C2 8.94 2 12 2 12s0 3.06.39 4.53a2.94 2.94 0 0 0 2.07 2.07C5.97 19 12 19 12 19s5.97 0 7.54-.4a2.94 2.94 0 0 0 2.07-2.07C22 15.06 22 12 22 12" />
      <path d="M10 15.02 15.27 12 10 8.98z" fill="var(--nori-cream-soft)" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 6.5 8 6.5 8-6.5" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.6 10.8a15.4 15.4 0 0 0 6.6 6.6l2.2-2.2c.28-.28.68-.36 1.03-.24 1.14.38 2.37.58 3.62.58.56 0 1 .45 1 1V20c0 .56-.44 1-1 1C10.4 21 3 13.6 3 4.5c0-.56.45-1 1-1h3.5c.56 0 1 .45 1 1 0 1.25.2 2.48.58 3.62.12.35.04.75-.24 1.03z" />
    </svg>
  );
}
