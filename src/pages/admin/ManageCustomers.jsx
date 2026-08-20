import { useEffect, useMemo, useState } from 'react';
import { getAllCustomers, getAllOrders } from '../../firebase/firestore';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

export default function ManageCustomers() {
  const [customers, setCustomers] = useState([]);
  const [orderCounts, setOrderCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const [customerList, orders] = await Promise.all([getAllCustomers(), getAllOrders()]);
      const counts = {};
      orders.forEach((o) => {
        counts[o.userId] = (counts[o.userId] || 0) + 1;
      });
      setCustomers(customerList);
      setOrderCounts(counts);
      setLoading(false);
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return customers.filter((c) => c.name?.toLowerCase().includes(q) || c.email?.toLowerCase().includes(q));
  }, [customers, search]);

  return (
    <div>
      <h1 style={{ fontSize: '1.7rem', marginBottom: 20 }}>Manage Customers</h1>

      <input
        className="nori-input"
        style={{ maxWidth: 300, marginBottom: 20 }}
        placeholder="Search by name or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading ? (
        <LoadingSpinner label="Loading customers…" />
      ) : filtered.length === 0 ? (
        <EmptyState title="No customers found" />
      ) : (
        <div className="nori-card nori-table-wrap" style={{ overflow: 'hidden' }}>
          <table className="nori-table">
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--nori-border)', fontSize: '0.8rem', color: 'var(--nori-coffee-mid)' }}>
                <th style={{ padding: '14px 20px' }}>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Delivery Location</th>
                <th style={{ paddingRight: 20 }}>Orders</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} style={{ borderBottom: '1px solid var(--nori-border)' }}>
                  <td style={{ padding: '12px 20px', fontWeight: 600 }}>{c.name || '—'}</td>
                  <td>{c.email}</td>
                  <td>{c.phone || '—'}</td>
                  <td>{c.delivery?.address ? `${c.delivery.address}, ${c.delivery.city}` : '—'}</td>
                  <td style={{ paddingRight: 20, fontWeight: 600 }}>{orderCounts[c.id] || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
