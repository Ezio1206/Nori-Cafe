import { useEffect, useState } from 'react';
import { getAllDrinks, getAllOrders, getAllCustomers } from '../../firebase/firestore';
import StatCard from '../../components/admin/StatCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { formatPrice } from '../../utils/formatPrice';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function load() {
      const [drinks, orders, customers] = await Promise.all([
        getAllDrinks(), getAllOrders(), getAllCustomers(),
      ]);
      const pending = orders.filter((o) => o.status !== 'Delivered').length;
      const completed = orders.filter((o) => o.status === 'Delivered').length;
      const sales = orders.reduce((sum, o) => sum + (o.total || 0), 0);

      setStats({
        totalDrinks: drinks.length,
        totalCustomers: customers.length,
        totalOrders: orders.length,
        pendingOrders: pending,
        completedOrders: completed,
        totalSales: sales,
      });
    }
    load();
  }, []);

  if (!stats) return <LoadingSpinner label="Loading dashboard…" />;

  return (
    <div>
      <h1 style={{ fontSize: '1.7rem', marginBottom: 24 }}>Dashboard</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 18 }}>
        <StatCard label="Total Drinks" value={stats.totalDrinks} />
        <StatCard label="Total Customers" value={stats.totalCustomers} />
        <StatCard label="Total Orders" value={stats.totalOrders} />
        <StatCard label="Pending Orders" value={stats.pendingOrders} accent="var(--nori-error)" />
        <StatCard label="Completed Orders" value={stats.completedOrders} accent="var(--nori-success)" />
        <StatCard label="Sales Overview" value={formatPrice(stats.totalSales)} accent="var(--nori-gold)" />
      </div>
    </div>
  );
}
