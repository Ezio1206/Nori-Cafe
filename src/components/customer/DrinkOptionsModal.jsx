import { useEffect, useState } from 'react';
import { SIZES, SIZE_LABELS, DEFAULT_SIZE, SUGAR_LEVELS, DEFAULT_SUGAR_LEVEL } from '../../utils/constants';
import { getSizePrice } from '../../utils/pricing';
import { formatPrice } from '../../utils/formatPrice';
import placeholder from '../../assets/drinks/placeholder.svg';

export default function DrinkOptionsModal({ open, drink, onAdd, onCancel }) {
  const [size, setSize] = useState(DEFAULT_SIZE);
  const [sugarLevel, setSugarLevel] = useState(DEFAULT_SUGAR_LEVEL);
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setSize(DEFAULT_SIZE);
      setSugarLevel(DEFAULT_SUGAR_LEVEL);
      setQuantity(1);
      setNote('');
    }
  }, [open, drink?.id]);

  if (!open || !drink) return null;

  const unitPrice = getSizePrice(drink, size);
  const total = unitPrice * quantity;

  function handleAdd() {
    onAdd(drink, quantity, { size, sugarLevel, note: note.trim() });
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Customize ${drink.name}`}
      className="modal-overlay"
      onClick={onCancel}
    >
      <div className="nori-card modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="drink-modal-header">
          <img
            src={drink.imageUrl || placeholder}
            alt={drink.name}
            className="drink-modal-image"
          />
          <div style={{ minWidth: 0 }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: 4 }}>{drink.name}</h3>
            {drink.description && (
              <p style={{ fontSize: '0.85rem', color: 'var(--nori-coffee-mid)', margin: 0 }}>
                {drink.description}
              </p>
            )}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <span className="nori-label" style={{ marginBottom: 10 }}>Size</span>
          <div className="option-pill-row">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                className={`option-pill${size === s ? ' is-selected' : ''}`}
                onClick={() => setSize(s)}
              >
                <span style={{ fontWeight: 700 }}>{s}</span>
                <span style={{ fontSize: '0.72rem', opacity: 0.85 }}>{SIZE_LABELS[s]}</span>
                <span style={{ fontSize: '0.75rem' }}>{formatPrice(getSizePrice(drink, s))}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <span className="nori-label" style={{ marginBottom: 10 }}>Sugar Level</span>
          <div className="option-pill-row">
            {SUGAR_LEVELS.map((level) => (
              <button
                key={level}
                type="button"
                className={`option-pill${sugarLevel === level ? ' is-selected' : ''}`}
                onClick={() => setSugarLevel(level)}
                style={{ minWidth: 56 }}
              >
                <span style={{ fontWeight: 700 }}>{level}</span>
              </button>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 20 }}>
          <label className="nori-label" htmlFor="drink-note" style={{ marginBottom: 10 }}>
            Description / Note <span style={{ fontWeight: 400 }}>(optional)</span>
          </label>
          <textarea
            id="drink-note"
            className="nori-input"
            rows={2}
            placeholder="Less ice, no whipped cream, etc."
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

        <div className="drink-modal-footer">
          <div className="qty-stepper">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="nori-btn nori-btn-secondary qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span style={{ minWidth: 22, textAlign: 'center', fontWeight: 700 }}>{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="nori-btn nori-btn-secondary qty-btn"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>

          <button
            type="button"
            className="nori-btn nori-btn-primary"
            style={{ flex: 1, minWidth: 160 }}
            onClick={handleAdd}
          >
            Add to Cart — {formatPrice(total)}
          </button>
        </div>

        <button
          type="button"
          className="nori-btn nori-btn-ghost"
          style={{ width: '100%', marginTop: 10 }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
