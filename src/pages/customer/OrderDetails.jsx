import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subscribeToOrder } from '../../firebase/firestore';
import OrderStatusTracker from '../../components/customer/OrderStatusTracker';
import DeliveryInfoDisplay from '../../components/customer/DeliveryInfoDisplay';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import { formatPrice, formatDate } from '../../utils/formatPrice';

export default function OrderDetails() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(undefined); // undefined = loading, null = not found

  useEffect(() => {
    const unsubscribe = subscribeToOrder(orderId, setOrder);
    return unsubscribe;
  }, [orderId]);

  if (order === undefined) return <LoadingSpinner label="Loading order…" />;

  if (order === null) {
    return (
      <div className="container" style={{ padding: '56px 24px' }}>
        <EmptyState
          title="Order not found"
          message="This order doesn't exist or may have been removed."
          action={<Link to="/history" className="nori-btn nori-btn-primary">Back to History</Link>}
        />
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 700 }}>
      <Link to="/history" style={{ color: 'var(--nori-coffee-mid)', fontSize: '0.88rem' }}>← Back to History</Link>

      <h1 style={{ fontSize: '1.7rem', margin: '10px 0 4px' }}>Order #{order.id.slice(0, 8).toUpperCase()}</h1>
      <p style={{ color: 'var(--nori-coffee-mid)', marginBottom: 28 }}>{formatDate(order.createdAt)}</p>

      <section className="nori-card" style={{ padding: 28, marginBottom: 20 }}>
        <OrderStatusTracker status={order.status} />
      </section>

      <section className="nori-card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.05rem', marginBottom: 14 }}>Items</h2>
        {order.items?.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', fontSize: '0.92rem', flexWrap: 'wrap' }}>
            <span>
              {item.name} × {item.quantity}
              {(item.size || item.sugarLevel) && (
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--nori-coffee-mid)' }}>
                  {item.size && `Size ${item.size}`}{item.size && item.sugarLevel && ' · '}{item.sugarLevel && `Sugar ${item.sugarLevel}`}
                </span>
              )}
              {item.note && (
                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--nori-coffee-mid)', fontStyle: 'italic' }}>
                  “{item.note}”
                </span>
              )}
            </span>
            <span>{formatPrice(item.price * item.quantity)}</span>
          </div>
        ))}
        <div style={{ borderTop: '1px solid var(--nori-border)', margin: '12px 0' }} />
        <Row label="Subtotal" value={formatPrice(order.subtotal)} />
        <Row label="Delivery fee" value={formatPrice(order.deliveryFee)} />
        <Row label="Total" value={formatPrice(order.total)} bold />
      </section>

      <section className="nori-card" style={{ padding: 24, marginBottom: 20 }}>
        <h2 style={{ fontSize: '1.05rem', marginBottom: 12 }}>Payment</h2>
        <Row label="Method" value={order.paymentMethod || '—'} />
        <Row label="Status" value={order.paymentStatus || '—'} />
        {order.paymentMethod === 'Online Payment' && order.paymentReceiptUrl && (
          <div style={{ marginTop: 14 }}>
            <span className="nori-label" style={{ marginBottom: 8 }}>Your uploaded receipt</span>
            <div className="receipt-admin-thumb" style={{ cursor: 'default', width: 120, height: 120 }}>
              <img src={order.paymentReceiptUrl} alt="Your uploaded payment receipt" />
            </div>
          </div>
        )}
      </section>

      <section className="nori-card" style={{ padding: 24 }}>
        <h2 style={{ fontSize: '1.05rem', marginBottom: 12 }}>Delivery Information</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--nori-coffee-mid)', marginBottom: 10 }}>
          This is exactly how it was submitted when the order was placed.
        </p>
        <DeliveryInfoDisplay info={order.deliveryInfo} />
      </section>
    </div>
  );
}

function Row({ label, value, bold }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontWeight: bold ? 700 : 500, fontSize: bold ? '1.05rem' : '0.92rem', color: bold ? 'var(--nori-coffee-deep)' : 'var(--nori-coffee-mid)' }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
