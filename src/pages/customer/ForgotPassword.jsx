import { useState } from 'react';
import { Link } from 'react-router-dom';
import { resetPassword } from '../../firebase/auth';
import Alert from '../../components/common/Alert';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setSent(true);
    } catch (err) {
      setError('We couldn\u2019t send a reset email for that address. Please check it and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <span className="nori-eyebrow">No worries</span>
      <h2 style={{ fontSize: '1.5rem', marginBottom: 20 }}>Reset your password</h2>

      <Alert type="error">{error}</Alert>
      <Alert type="success">{sent && 'Check your inbox — we sent a password reset link.'}</Alert>

      {!sent && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="nori-label" htmlFor="fp-email">Email</label>
            <input id="fp-email" type="email" required className="nori-input" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button className="nori-btn nori-btn-primary" type="submit" disabled={loading}>
            {loading ? 'Sending…' : 'Send Reset Link'}
          </button>
        </form>
      )}

      <div style={{ marginTop: 18, fontSize: '0.88rem', textAlign: 'center', color: 'var(--nori-coffee-mid)' }}>
        <Link to="/login">Back to sign in</Link>
      </div>
    </>
  );
}
