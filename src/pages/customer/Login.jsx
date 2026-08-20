import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login, getUserProfile } from '../../firebase/auth';
import Alert from '../../components/common/Alert';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);

      // Route by the account's actual role (Firestore `users/{uid}.role`),
      // never by username/email — admins land straight on the Admin
      // Dashboard, customers go to wherever they were headed (or Home).
      // We look this up directly rather than waiting on AuthContext's
      // profile fetch, since that happens asynchronously off the
      // onAuthStateChanged listener and may not have resolved yet here.
      const profile = await getUserProfile(user.uid);

      if (profile?.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        const redirectTo = location.state?.from?.pathname || '/';
        navigate(redirectTo, { replace: true });
      }
    } catch (err) {
      setError(mapAuthError(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <span className="nori-eyebrow">Welcome back</span>
      <h2 style={{ fontSize: '1.5rem', marginBottom: 20 }}>Sign in to Nori Coffee</h2>

      <Alert type="error">{error}</Alert>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="nori-label" htmlFor="login-email">Email</label>
          <input id="login-email" type="email" required className="nori-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="nori-label" htmlFor="login-password">Password</label>
          <input id="login-password" type="password" required className="nori-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="nori-btn nori-btn-primary" type="submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </form>

      <div style={{ marginTop: 18, fontSize: '0.88rem', display: 'flex', justifyContent: 'space-between', color: 'var(--nori-coffee-mid)' }}>
        <Link to="/forgot-password">Forgot password?</Link>
        <Link to="/register">Create an account</Link>
      </div>
    </>
  );
}

function mapAuthError(code) {
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'Incorrect email or password. Please try again.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a moment and try again.';
    default:
      return 'We couldn\u2019t sign you in. Please check your details and try again.';
  }
}
