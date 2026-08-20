import { useState, useEffect } from 'react';
import { DRINK_CATEGORIES, SIZES, SIZE_LABELS } from '../../utils/constants';
import { normalizeSizePricing } from '../../utils/pricing';
import placeholder from '../../assets/drinks/placeholder.svg';

const EMPTY = {
  name: '', description: '', price: '', category: 'Coffee', imageUrl: '', available: true,
  sizePricing: { S: '', M: '', L: '' },
};

function isLikelyValidUrl(value) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}

export default function DrinkFormModal({ open, initialValues, onSave, onCancel, saving }) {
  const [form, setForm] = useState(EMPTY);
  const [urlError, setUrlError] = useState('');
  const [imageBroken, setImageBroken] = useState(false);

  useEffect(() => {
    if (open) {
      if (initialValues) {
        setForm({
          ...EMPTY,
          ...initialValues,
          sizePricing: {
            S: initialValues.sizePricing?.S ?? '',
            M: initialValues.sizePricing?.M ?? '',
            L: initialValues.sizePricing?.L ?? '',
          },
        });
      } else {
        setForm(EMPTY);
      }
      setUrlError('');
      setImageBroken(false);
    }
  }, [open, initialValues]);

  if (!open) return null;

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === 'imageUrl') {
      setImageBroken(false);
      setUrlError('');
    }
  }

  function updateSizePrice(size, value) {
    setForm((prev) => ({ ...prev, sizePricing: { ...prev.sizePricing, [size]: value } }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!isLikelyValidUrl(form.imageUrl)) {
      setUrlError('Please enter a valid image URL starting with http:// or https://');
      return;
    }

    onSave({
      ...form,
      price: form.price,
      description: form.description.trim(),
      sizePricing: normalizeSizePricing(form.price, form.sizePricing),
    });
  }

  return (
    <div
      role="dialog" aria-modal="true"
      className="modal-overlay"
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        className="nori-card modal-panel"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 style={{ fontSize: '1.25rem', marginBottom: 20 }}>{initialValues ? 'Edit Drink' : 'Add Drink'}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label className="nori-label" htmlFor="d-name">Name</label>
            <input id="d-name" required className="nori-input" value={form.name} onChange={(e) => update('name', e.target.value)} />
          </div>

          <div>
            <label className="nori-label" htmlFor="d-desc">Description <span style={{ fontWeight: 400, color: 'var(--nori-coffee-mid)' }}>(optional)</span></label>
            <textarea id="d-desc" rows={3} className="nori-input" value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="A short description customers will see on the menu…" />
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 140px' }}>
              <label className="nori-label" htmlFor="d-price">Base Price ($)</label>
              <input id="d-price" required type="number" step="0.01" min="0" className="nori-input" value={form.price} onChange={(e) => update('price', e.target.value)} />
            </div>
            <div style={{ flex: '1 1 140px' }}>
              <label className="nori-label" htmlFor="d-category">Category</label>
              <select id="d-category" className="nori-input" value={form.category} onChange={(e) => update('category', e.target.value)}>
                {DRINK_CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="nori-label">
              Size Pricing <span style={{ fontWeight: 400, color: 'var(--nori-coffee-mid)' }}>(optional — leave blank to use the base price)</span>
            </label>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {SIZES.map((size) => (
                <div key={size} style={{ flex: '1 1 90px' }}>
                  <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--nori-coffee-mid)', marginBottom: 4 }}>
                    {size} · {SIZE_LABELS[size]}
                  </span>
                  <input
                    type="number" step="0.01" min="0" className="nori-input"
                    placeholder={form.price || '0.00'}
                    value={form.sizePricing[size]}
                    onChange={(e) => updateSizePrice(size, e.target.value)}
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="nori-label" htmlFor="d-imageurl">Image URL</label>
            <input
              id="d-imageurl"
              required
              type="url"
              className="nori-input"
              placeholder="https://example.com/iced-latte.jpg"
              value={form.imageUrl}
              onChange={(e) => update('imageUrl', e.target.value)}
            />
            {urlError && <p style={{ color: 'var(--nori-error)', fontSize: '0.82rem', marginTop: 6 }}>{urlError}</p>}

            {form.imageUrl && (
              <div style={{ marginTop: 12 }}>
                <span className="nori-label" style={{ marginBottom: 6 }}>Preview</span>
                <div className="nori-preview-box">
                  <img
                    src={imageBroken ? placeholder : form.imageUrl}
                    alt="Drink preview"
                    onError={() => setImageBroken(true)}
                  />
                </div>
                {imageBroken && (
                  <p style={{ color: 'var(--nori-error)', fontSize: '0.82rem', marginTop: 6 }}>
                    This URL couldn't be loaded as an image. You can still save it, but double-check the link.
                  </p>
                )}
              </div>
            )}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '0.9rem' }}>
            <input type="checkbox" checked={form.available} onChange={(e) => update('available', e.target.checked)} />
            Available for order
          </label>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 24, flexWrap: 'wrap' }}>
          <button type="button" className="nori-btn nori-btn-secondary" onClick={onCancel}>Cancel</button>
          <button type="submit" className="nori-btn nori-btn-primary" disabled={saving}>
            {saving ? 'Saving…' : initialValues ? 'Save Changes' : 'Add Drink'}
          </button>
        </div>
      </form>
    </div>
  );
}
