import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerCustomer } from '../../firebase/auth';
import Alert from '../../components/common/Alert';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await registerCustomer({ name, email, password });
      navigate('/', { replace: true });
    } catch (err) {
      setError(mapAuthError(err.code));
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <span className="nori-eyebrow">Join us</span>
      <h2 style={{ fontSize: '1.5rem', marginBottom: 20 }}>Create your account</h2>

      <Alert type="error">{error}</Alert>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="nori-label" htmlFor="reg-name">Full name</label>
          <input id="reg-name" required className="nori-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="nori-label" htmlFor="reg-email">Email</label>
          <input id="reg-email" type="email" required className="nori-input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="nori-label" htmlFor="reg-password">Password</label>
          <input id="reg-password" type="password" required className="nori-input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div>
          <label className="nori-label" htmlFor="reg-confirm">Confirm password</label>
          <input id="reg-confirm" type="password" required className="nori-input" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <button className="nori-btn nori-btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account'}
        </button>
      </form>

      <div style={{ marginTop: 18, fontSize: '0.88rem', textAlign: 'center', color: 'var(--nori-coffee-mid)' }}>
        Already have an account? <Link to="/login">Sign in</Link>
      </div>
    </>
  );
}

function mapAuthError(code) {
  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Please choose a stronger password.';
    default:
      return 'We couldn\u2019t create your account. Please try again.';
  }
}
