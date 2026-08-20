import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { subscribeToUserOrders } from '../../firebase/firestore';
import { formatPrice, formatDate } from '../../utils/formatPrice';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

const STATUS_CLASS = {
  'Order Placed': 'status-placed',
  Preparing: 'status-preparing',
  'Out for Delivery': 'status-out',
  Delivered: 'status-delivered',
};

export default function History() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToUserOrders(user.uid, (data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsubscribe;
  }, [user]);

  return (
    <div className="container" style={{ padding: '48px 24px', maxWidth: 820 }}>
      <h1 style={{ fontSize: '1.8rem', marginBottom: 24 }}>Order History</h1>

      {loading ? (
        <LoadingSpinner label="Loading your orders…" />
      ) : orders.length === 0 ? (
        <EmptyState
          title="You've never ordered before."
          message="Your placed orders will show up here so you can track them."
          action={<Link to="/" className="nori-btn nori-btn-primary">Browse Drinks</Link>}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {orders.map((order) => (
            <Link key={order.id} to={`/history/${order.id}`} className="nori-card" style={{ padding: 20, display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--nori-coffee-deep)' }}>Order #{order.id.slice(0, 8).toUpperCase()}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--nori-coffee-mid)' }}>{formatDate(order.createdAt)}</div>
                </div>
                <span className={`nori-status-badge ${STATUS_CLASS[order.status] || ''}`}>{order.status}</span>
              </div>
              <div style={{ marginTop: 10, fontSize: '0.88rem', color: 'var(--nori-coffee-mid)' }}>
                {order.items?.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
              </div>
              <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <span style={{ fontWeight: 700, color: 'var(--nori-coffee-deep)' }}>{formatPrice(order.total)}</span>
                {order.paymentMethod && (
                  <span style={{ fontSize: '0.78rem', color: 'var(--nori-coffee-mid)' }}>
                    {order.paymentMethod} · {order.paymentStatus}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
