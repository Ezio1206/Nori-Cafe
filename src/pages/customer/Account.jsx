import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { updateUserProfile, updateUserDelivery } from '../../firebase/firestore';
import DeliveryLocationForm from '../../components/customer/DeliveryLocationForm';
import DeliveryInfoDisplay from '../../components/customer/DeliveryInfoDisplay';
import Alert from '../../components/common/Alert';

export default function Account() {
  const { profile, user, logout, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [profileForm, setProfileForm] = useState({
    name: profile?.name || '',
    phone: profile?.phone || '',
    description: profile?.description || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  const [editingDelivery, setEditingDelivery] = useState(false);
  const [savingDelivery, setSavingDelivery] = useState(false);
  const [deliverySuccess, setDeliverySuccess] = useState('');
  const [deliveryError, setDeliveryError] = useState('');

  function updateProfileField(field, value) {
    setProfileForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      await updateUserProfile(user.uid, profileForm);
      await refreshProfile();
      setProfileSuccess('Your profile has been saved.');
    } catch (err) {
      setProfileError('We couldn\u2019t save your changes. Please try again.');
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleSaveDelivery(form) {
    setSavingDelivery(true);
    setDeliveryError('');
    try {
      await updateUserDelivery(user.uid, form);
      await refreshProfile();
      setDeliverySuccess('Your delivery information has been saved.');
      setEditingDelivery(false);
    } catch (err) {
      setDeliveryError('We couldn\u2019t save your delivery information. Please try again.');
    } finally {
      setSavingDelivery(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  if (!profile) return null;

  const hasDelivery = Boolean(profile.delivery?.fullName && profile.delivery?.city);

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 560 }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 24 }}>My Account</h1>

      {/* Profile section */}
      <Alert type="error">{profileError}</Alert>
      <Alert type="success">{profileSuccess}</Alert>

      <form onSubmit={handleSaveProfile} className="nori-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 24 }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 4 }}>Profile</h2>
        <div>
          <label className="nori-label" htmlFor="acc-name">Name</label>
          <input id="acc-name" className="nori-input" value={profileForm.name} onChange={(e) => updateProfileField('name', e.target.value)} />
        </div>
        <div>
          <label className="nori-label">Email</label>
          <input className="nori-input" value={profile.email} disabled style={{ opacity: 0.6 }} />
        </div>
        <div>
          <label className="nori-label" htmlFor="acc-phone">Phone number</label>
          <input id="acc-phone" className="nori-input" value={profileForm.phone} onChange={(e) => updateProfileField('phone', e.target.value)} />
        </div>
        <div>
          <label className="nori-label" htmlFor="acc-desc">Description <span style={{ fontWeight: 400, color: 'var(--nori-coffee-mid)' }}>(personal note, optional)</span></label>
          <textarea
            id="acc-desc" className="nori-input" rows={3}
            value={profileForm.description}
            onChange={(e) => updateProfileField('description', e.target.value)}
            placeholder="Anything you'd like to note on your account — this isn't used for delivery."
          />
        </div>

        <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
          <button type="submit" className="nori-btn nori-btn-primary" disabled={savingProfile}>
            {savingProfile ? 'Saving…' : 'Save Profile'}
          </button>
          <button type="button" className="nori-btn nori-btn-secondary" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </form>

      {/* Delivery information section */}
      <Alert type="error">{deliveryError}</Alert>
      <Alert type="success">{deliverySuccess}</Alert>

      <div className="nori-card" style={{ padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: editingDelivery ? 18 : 12 }}>
          <h2 style={{ fontSize: '1.1rem' }}>Delivery Information</h2>
          {!editingDelivery && (
            <button className="nori-btn nori-btn-ghost" onClick={() => setEditingDelivery(true)}>
              {hasDelivery ? 'Edit' : 'Add'}
            </button>
          )}
        </div>

        {editingDelivery ? (
          <DeliveryLocationForm
            initialValues={profile.delivery}
            onSave={handleSaveDelivery}
            onCancel={hasDelivery ? () => setEditingDelivery(false) : undefined}
            saving={savingDelivery}
          />
        ) : hasDelivery ? (
          <DeliveryInfoDisplay info={profile.delivery} />
        ) : (
          <p style={{ color: 'var(--nori-coffee-mid)', fontSize: '0.9rem' }}>
            You haven't added delivery information yet. Add it now so checkout is faster next time you order.
          </p>
        )}
      </div>
    </div>
  );
}
