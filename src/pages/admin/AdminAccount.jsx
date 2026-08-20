import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile } from '../../firebase/firestore';
import Alert from '../../components/common/Alert';

export default function AdminAccount() {
  const { profile, user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSuccess('');
    setError('');
    try {
      await updateUserProfile(user.uid, { name, phone });
      await refreshProfile();
      setSuccess('Your admin profile has been updated.');
    } catch (err) {
      setError('We couldn\u2019t save your changes. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  if (!profile) return null;

  return (
    <div style={{ maxWidth: 480 }}>
      <h1 style={{ fontSize: '1.7rem', marginBottom: 20 }}>Admin Account</h1>

      <Alert type="error">{error}</Alert>
      <Alert type="success">{success}</Alert>

      <form onSubmit={handleSave} className="nori-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <label className="nori-label" htmlFor="adm-name">Name</label>
          <input id="adm-name" className="nori-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="nori-label">Email</label>
          <input className="nori-input" value={profile.email} disabled style={{ opacity: 0.6 }} />
        </div>
        <div>
          <label className="nori-label" htmlFor="adm-phone">Phone number</label>
          <input id="adm-phone" className="nori-input" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button type="submit" className="nori-btn nori-btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" className="nori-btn nori-btn-secondary" onClick={handleLogout}>Log Out</button>
        </div>
      </form>
    </div>
  );
}
