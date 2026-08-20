import { useEffect, useMemo, useState } from 'react';
import { subscribeToAllOrders, updateOrderStatus, updatePaymentStatus } from '../../firebase/firestore';
import DeliveryInfoDisplay from '../../components/customer/DeliveryInfoDisplay';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';
import Alert from '../../components/common/Alert';
import { formatPrice, formatDate } from '../../utils/formatPrice';
import { ORDER_STATUSES, PAYMENT_METHODS, PAYMENT_STATUSES } from '../../utils/constants';

const STATUS_CLASS = {
  'Order Placed': 'status-placed',
  Preparing: 'status-preparing',
  'Out for Delivery': 'status-out',
  Delivered: 'status-delivered',
};

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');
  const [receiptPreview, setReceiptPreview] = useState(null); // receipt URL currently zoomed, or null

  useEffect(() => {
    const unsubscribe = subscribeToAllOrders((data) => {
      setOrders(data);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchesStatus = statusFilter === 'All' || o.status === statusFilter;
      const matchesPayment = paymentFilter === 'All' || o.paymentMethod === paymentFilter;
      const matchesDate =
        !dateFilter ||
        (o.createdAt?.toDate && o.createdAt.toDate().toISOString().slice(0, 10) === dateFilter);
      const q = search.toLowerCase();
      const matchesSearch =
        o.id.toLowerCase().includes(q) ||
        o.deliveryInfo?.fullName?.toLowerCase().includes(q) ||
        o.deliveryInfo?.phone?.toLowerCase().includes(q) ||
        o.items?.some((i) => i.name.toLowerCase().includes(q));
      return matchesStatus && matchesPayment && matchesDate && matchesSearch;
    });
  }, [orders, search, statusFilter, paymentFilter, dateFilter]);

  async function handleStatusChange(orderId, status) {
    setError('');
    try {
      await updateOrderStatus(orderId, status);
    } catch (err) {
      setError('We couldn\u2019t update this order\u2019s status. Please try again.');
    }
  }

  async function handleMarkPaid(orderId) {
    setError('');
    try {
      await updatePaymentStatus(orderId, PAYMENT_STATUSES.ONLINE_PAID);
    } catch (err) {
      setError('We couldn\u2019t update the payment status. Please try again.');
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.7rem', marginBottom: 20 }}>Manage Orders</h1>
      <Alert type="error">{error}</Alert>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <input
          className="nori-input"
          style={{ flex: '1 1 240px', maxWidth: 320 }}
          placeholder="Search by order ID, customer, phone, or drink…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="nori-input" style={{ flex: '1 1 160px', maxWidth: 200 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="All">All statuses</option>
          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select className="nori-input" style={{ flex: '1 1 160px', maxWidth: 200 }} value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="All">All payment methods</option>
          {PAYMENT_METHODS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <input
          type="date"
          className="nori-input"
          style={{ flex: '1 1 160px', maxWidth: 200 }}
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          aria-label="Filter by date"
        />
        {dateFilter && (
          <button className="nori-btn nori-btn-ghost" onClick={() => setDateFilter('')}>Clear date</button>
        )}
      </div>

      {loading ? (
        <LoadingSpinner label="Loading orders…" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No orders found" message="Try a different search or filter." />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filtered.map((order) => {
            const expanded = expandedId === order.id;
            const isOnline = order.paymentMethod === 'Online Payment';
            const isPaid = order.paymentStatus === PAYMENT_STATUSES.ONLINE_PAID;
            return (
              <div key={order.id} className="nori-card" style={{ padding: 20 }}>
                <div
                  style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', cursor: 'pointer' }}
                  onClick={() => setExpandedId(expanded ? null : order.id)}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 700 }}>Order #{order.id.slice(0, 8).toUpperCase()}</div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--nori-coffee-mid)' }}>
                      {order.deliveryInfo?.fullName} · {order.deliveryInfo?.phone} · {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700 }}>{formatPrice(order.total)}</span>
                    <span className="nori-tag" style={{ background: isOnline ? 'var(--nori-tan-soft)' : '#E4D9C4' }}>
                      {order.paymentMethod || '—'}
                    </span>
                    <span className={`nori-status-badge ${STATUS_CLASS[order.status] || ''}`}>{order.status}</span>
                  </div>
                </div>

                {expanded && (
                  <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--nori-border)' }}>
                    <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--nori-coffee-mid)', marginBottom: 8 }}>Items</h4>
                        {order.items?.map((i, idx) => (
                          <div key={idx} style={{ fontSize: '0.9rem', padding: '4px 0' }}>
                            {i.name} × {i.quantity} — {formatPrice(i.price * i.quantity)}
                            {(i.size || i.sugarLevel) && (
                              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--nori-coffee-mid)' }}>
                                {i.size && `Size ${i.size}`}{i.size && i.sugarLevel && ' · '}{i.sugarLevel && `Sugar ${i.sugarLevel}`}
                              </span>
                            )}
                            {i.note && (
                              <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--nori-coffee-mid)', fontStyle: 'italic' }}>
                                Note: “{i.note}”
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--nori-coffee-mid)', marginBottom: 8 }}>Delivery Info</h4>
                        <DeliveryInfoDisplay info={order.deliveryInfo} compact />
                      </div>
                      <div style={{ flex: 1, minWidth: 220 }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--nori-coffee-mid)', marginBottom: 8 }}>Payment</h4>
                        <div style={{ fontSize: '0.9rem', marginBottom: 6 }}>
                          <strong style={{ color: 'var(--nori-coffee-deep)' }}>{order.paymentMethod || '—'}</strong>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: isPaid ? 'var(--nori-success)' : 'var(--nori-coffee-mid)', fontWeight: 600, marginBottom: 10 }}>
                          {order.paymentStatus || '—'}
                        </div>
                        {isOnline && (
                          order.paymentReceiptUrl ? (
                            <button
                              type="button"
                              className="receipt-admin-thumb"
                              style={{ marginBottom: 10 }}
                              onClick={(e) => { e.stopPropagation(); setReceiptPreview(order.paymentReceiptUrl); }}
                              aria-label="View uploaded payment receipt"
                            >
                              <img src={order.paymentReceiptUrl} alt="Uploaded payment receipt" />
                            </button>
                          ) : (
                            <div style={{ fontSize: '0.78rem', color: 'var(--nori-error)', marginBottom: 10 }}>
                              No receipt uploaded
                            </div>
                          )
                        )}
                        {isOnline && !isPaid && (
                          <button
                            className="nori-btn nori-btn-secondary"
                            style={{ fontSize: '0.82rem', padding: '8px 14px' }}
                            onClick={(e) => { e.stopPropagation(); handleMarkPaid(order.id); }}
                          >
                            Mark as Paid
                          </button>
                        )}
                      </div>
                    </div>

                    <div style={{ marginTop: 16 }}>
                      <label className="nori-label" htmlFor={`status-${order.id}`}>Update status</label>
                      <select
                        id={`status-${order.id}`}
                        className="nori-input"
                        style={{ maxWidth: 220 }}
                        value={order.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {receiptPreview && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Payment receipt"
          className="modal-overlay"
          onClick={() => setReceiptPreview(null)}
        >
          <div
            className="nori-card modal-panel"
            style={{ padding: 16, textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={receiptPreview}
              alt="Payment receipt (full size)"
              style={{ width: '100%', maxHeight: '70vh', objectFit: 'contain', borderRadius: 8 }}
            />
            <button
              type="button"
              className="nori-btn nori-btn-secondary"
              style={{ width: '100%', marginTop: 14 }}
              onClick={() => setReceiptPreview(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
