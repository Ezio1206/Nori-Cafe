import { useState, useEffect } from 'react';

const EMPTY = { fullName: '', phone: '', city: '', address: '', googleMapsUrl: '', deliveryNote: '' };

function isLikelyValidUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function DeliveryLocationForm({ initialValues, onSave, onCancel, saving }) {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm({ ...EMPTY, ...initialValues });
  }, [initialValues]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function validate() {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Full name is required.';
    if (!form.phone.trim()) next.phone = 'Phone number is required.';
    if (!form.city.trim()) next.city = 'City / area is required.';
    if (!form.address.trim()) next.address = 'Road / street / address is required.';
    if (!form.googleMapsUrl.trim()) next.googleMapsUrl = 'A Google Maps URL is required.';
    else if (!isLikelyValidUrl(form.googleMapsUrl)) next.googleMapsUrl = 'Please paste a valid link starting with http:// or https://';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div>
        <span className="nori-label" style={{ marginBottom: 10, fontSize: '0.9rem' }}>Basic information</span>
      </div>
      <div>
        <label className="nori-label" htmlFor="dl-fullname">Full name</label>
        <input id="dl-fullname" className="nori-input" value={form.fullName} onChange={(e) => update('fullName', e.target.value)} />
        {errors.fullName && <Error text={errors.fullName} />}
      </div>
      <div>
        <label className="nori-label" htmlFor="dl-phone">Phone number</label>
        <input id="dl-phone" className="nori-input" value={form.phone} onChange={(e) => update('phone', e.target.value)} />
        {errors.phone && <Error text={errors.phone} />}
      </div>

      <div style={{ borderTop: '1px solid var(--nori-border)', margin: '4px 0' }} />
      <span className="nori-label" style={{ fontSize: '0.9rem' }}>Location</span>

      <div>
        <label className="nori-label" htmlFor="dl-city">City / area</label>
        <input id="dl-city" className="nori-input" value={form.city} onChange={(e) => update('city', e.target.value)} placeholder="e.g. Phnom Penh, Toul Tom Poung" />
        {errors.city && <Error text={errors.city} />}
      </div>
      <div>
        <label className="nori-label" htmlFor="dl-address">Road / street / address</label>
        <input id="dl-address" className="nori-input" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="e.g. Street 271" />
        {errors.address && <Error text={errors.address} />}
      </div>
      <div>
        <label className="nori-label" htmlFor="dl-maps">Google Maps URL</label>
        <input id="dl-maps" type="url" className="nori-input" value={form.googleMapsUrl} onChange={(e) => update('googleMapsUrl', e.target.value)} placeholder="https://maps.google.com/…" />
        {errors.googleMapsUrl && <Error text={errors.googleMapsUrl} />}
      </div>

      <div style={{ borderTop: '1px solid var(--nori-border)', margin: '4px 0' }} />

      <div>
        <label className="nori-label" htmlFor="dl-note">Delivery note <span style={{ fontWeight: 400, color: 'var(--nori-coffee-mid)' }}>(optional)</span></label>
        <textarea
          id="dl-note" className="nori-input" rows={3}
          value={form.deliveryNote} onChange={(e) => update('deliveryNote', e.target.value)}
          placeholder="e.g. Blue gate. Please call when you arrive."
        />
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
        <button type="submit" className="nori-btn nori-btn-primary" disabled={saving}>
          {saving ? 'Saving…' : 'Save delivery information'}
        </button>
        {onCancel && (
          <button type="button" className="nori-btn nori-btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

function Error({ text }) {
  return <p style={{ color: 'var(--nori-error)', fontSize: '0.8rem', marginTop: 4 }}>{text}</p>;
}
