import { formatPrice } from '../../utils/formatPrice';
import { useCart } from '../../context/CartContext';
import placeholder from '../../assets/drinks/placeholder.svg';

export default function CartItemRow({ item }) {
  const { increaseQuantity, decreaseQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item-row">
      <div className="nori-thumb cart-item-thumb">
        <img src={item.imageUrl || placeholder} alt={item.name} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600 }}>{item.name}</div>
        <div style={{ color: 'var(--nori-coffee-mid)', fontSize: '0.88rem' }}>
          {formatPrice(item.price)} each
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
          {item.size && <span className="nori-tag">Size {item.size}</span>}
          {item.sugarLevel && <span className="nori-tag">Sugar {item.sugarLevel}</span>}
        </div>
        {item.note && (
          <div style={{ fontSize: '0.82rem', color: 'var(--nori-coffee-mid)', marginTop: 6, fontStyle: 'italic' }}>
            “{item.note}”
          </div>
        )}
      </div>

      <div className="cart-item-controls">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            aria-label={`Decrease quantity of ${item.name}`}
            className="nori-btn nori-btn-secondary"
            style={{ width: 32, height: 32, padding: 0, borderRadius: '50%' }}
            onClick={() => decreaseQuantity(item.lineKey)}
          >
            −
          </button>
          <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
          <button
            aria-label={`Increase quantity of ${item.name}`}
            className="nori-btn nori-btn-secondary"
            style={{ width: 32, height: 32, padding: 0, borderRadius: '50%' }}
            onClick={() => increaseQuantity(item.lineKey)}
          >
            +
          </button>
        </div>

        <div style={{ minWidth: 60, textAlign: 'right', fontWeight: 700, color: 'var(--nori-coffee-deep)' }}>
          {formatPrice(item.price * item.quantity)}
        </div>

        <button
          aria-label={`Remove ${item.name} from cart`}
          className="nori-btn nori-btn-ghost"
          onClick={() => removeFromCart(item.lineKey)}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
