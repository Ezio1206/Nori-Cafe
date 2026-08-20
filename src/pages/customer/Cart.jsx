import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import CartItemRow from '../../components/customer/CartItemRow';
import EmptyState from '../../components/common/EmptyState';
import { formatPrice } from '../../utils/formatPrice';

export default function Cart() {
  const { items, subtotal, deliveryFee, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="container" style={{ padding: '56px 24px' }}>
        <EmptyState
          title="Your cart is empty"
          message="Add a few drinks from the menu to get started."
          action={<Link to="/" className="nori-btn nori-btn-primary">Browse Drinks</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 760 }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 24 }}>Your Cart</h1>

      <div className="nori-card" style={{ padding: '8px 24px' }}>
        {items.map((item) => (
          <CartItemRow key={item.lineKey} item={item} />
        ))}
      </div>

      <div className="nori-card" style={{ padding: 24, marginTop: 20 }}>
        <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
        <SummaryRow label="Delivery fee" value={formatPrice(deliveryFee)} />
        <div style={{ borderTop: '1px solid var(--nori-border)', margin: '10px 0' }} />
        <SummaryRow label="Total" value={formatPrice(total)} bold />

        <Link
          to="/checkout"
          className="nori-btn nori-btn-primary"
          style={{ width: '100%', marginTop: 18 }}
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontWeight: bold ? 700 : 500, fontSize: bold ? '1.1rem' : '0.95rem', color: bold ? 'var(--nori-coffee-deep)' : 'var(--nori-coffee-mid)' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
