import { DRINK_CATEGORIES } from '../../utils/constants';

export default function CategoryFilter({ active, onChange }) {
  return (
    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
      {DRINK_CATEGORIES.map((cat) => {
        const isActive = active === cat;
        return (
          <button
            key={cat}
            onClick={() => onChange(cat)}
            className="nori-btn"
            style={{
              padding: '8px 18px',
              background: isActive ? 'var(--nori-coffee)' : 'var(--nori-tan-soft)',
              color: isActive ? 'var(--nori-cream-soft)' : 'var(--nori-coffee-deep)',
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
