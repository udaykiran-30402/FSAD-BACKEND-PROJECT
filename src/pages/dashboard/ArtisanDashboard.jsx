import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProducts, getReviews } from '../../utils/storage';
import { getOrders } from '../../services/orderService';

function ArtisanDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(Array.isArray(response.data) ? response.data : response.data?.data || []);
      } catch {
        setOrders([]);
      }
    };

    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const products = getProducts().filter((item) => item.artisanName === user?.name);
    const pendingOrders = orders.filter((item) => item.status === 'PLACED' || item.status === 'Placed').length;
    const ratings = getReviews().map((item) => item.rating);
    const avg = ratings.length ? (ratings.reduce((sum, value) => sum + value, 0) / ratings.length).toFixed(1) : '0.0';
    return { products: products.length, pendingOrders, avg };
  }, [orders, user]);

  return (
    <div className="space-y-5">
      <h1 className="section-title">Artisan Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card flex min-h-28 flex-col justify-between p-5"><p className="text-sm">Listed Products</p><p className="text-2xl font-bold">{stats.products}</p></div>
        <div className="card flex min-h-28 flex-col justify-between p-5"><p className="text-sm">Pending Orders</p><p className="text-2xl font-bold">{stats.pendingOrders}</p></div>
        <div className="card flex min-h-28 flex-col justify-between p-5"><p className="text-sm">Avg Rating</p><p className="text-2xl font-bold">{stats.avg}</p></div>
      </div>
      <p className="break-words text-tribal-700">Use sidebar links to add/edit products and manage listings.</p>
    </div>
  );
}

export default ArtisanDashboard;
