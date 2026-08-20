import { useState } from 'react';
import { formatPrice } from '../../utils/formatPrice';
import { getDrinkPriceRange } from '../../utils/pricing';
import { useCart } from '../../context/CartContext';
import DrinkOptionsModal from './DrinkOptionsModal';
import placeholder from '../../assets/drinks/placeholder.svg';

export default function DrinkCard({ drink }) {
  const { addToCart } = useCart();
  const [modalOpen, setModalOpen] = useState(false);
  const [added, setAdded] = useState(false);

  const { min, max, sameForAll } = getDrinkPriceRange(drink);

  function handleAdd(drinkArg, quantity, options) {
    addToCart(drinkArg, quantity, options);
    setModalOpen(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="nori-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div className="nori-thumb" style={{ aspectRatio: '4 / 3' }}>
        <img src={drink.imageUrl || placeholder} alt={drink.name} />
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
          <h3 style={{ fontSize: '1.05rem' }}>{drink.name}</h3>
          <span className="nori-tag">{drink.category}</span>
        </div>
        <p style={{ fontSize: '0.86rem', color: 'var(--nori-coffee-mid)', margin: 0, flex: 1 }}>
          {drink.description}
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, gap: 10, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', color: 'var(--nori-coffee-deep)' }}>
            {sameForAll ? formatPrice(min) : `${formatPrice(min)} – ${formatPrice(max)}`}
          </span>
          {drink.available === false ? (
            <span style={{ fontSize: '0.8rem', color: 'var(--nori-error)', fontWeight: 600 }}>Unavailable</span>
          ) : (
            <button className="nori-btn nori-btn-primary" onClick={() => setModalOpen(true)} disabled={added}>
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
          )}
        </div>
      </div>

      <DrinkOptionsModal
        open={modalOpen}
        drink={drink}
        onAdd={handleAdd}
        onCancel={() => setModalOpen(false)}
      />
    </div>
  );
}
