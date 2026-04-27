import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getCart, getReviews } from '../../utils/storage';
import { getOrders } from '../../services/orderService';

function CustomerDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const response = await getOrders();
        const data = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setOrders(data);
      } catch {
        setOrders([]);
      }
    };

    loadOrders();
  }, []);

  const stats = useMemo(() => {
    const cart = getCart();
    const userOrders = orders.filter((item) => Number(item.userId) === Number(user?.id));
    const reviews = getReviews().filter((item) => item.userId === user?.id);
    return { cartItems: cart.reduce((sum, item) => sum + item.quantity, 0), orders: userOrders.length, reviews: reviews.length };
  }, [orders, user]);

  return (
    <div className="space-y-5">
      <h1 className="section-title">Customer Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card flex min-h-28 flex-col justify-between p-5"><p className="text-sm">Cart Items</p><p className="text-2xl font-bold">{stats.cartItems}</p></div>
        <div className="card flex min-h-28 flex-col justify-between p-5"><p className="text-sm">Orders Placed</p><p className="text-2xl font-bold">{stats.orders}</p></div>
        <div className="card flex min-h-28 flex-col justify-between p-5"><p className="text-sm">Reviews Left</p><p className="text-2xl font-bold">{stats.reviews}</p></div>
      </div>
      <p className="break-words text-tribal-700">Browse products, place orders, and review crafts you purchase.</p>
    </div>
  );
}

export default CustomerDashboard;
