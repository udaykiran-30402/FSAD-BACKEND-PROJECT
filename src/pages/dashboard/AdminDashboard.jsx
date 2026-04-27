import { useEffect, useState } from 'react';
import { getProducts, getReviews } from '../../utils/storage';
import API from '../../utils/api';
import { getOrders } from '../../services/orderService';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState('');
  const products = getProducts();
  const reviews = getReviews();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError('');
        const response = await API.get('/users');
        setUsers(response.data?.data || []);
      } catch (error) {
        setUsersError(error.response?.data?.message || 'Unable to load users.');
        setUsers([]);
      } finally {
        setUsersLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders();
        setOrders(Array.isArray(response.data) ? response.data : response.data?.data || []);
      } catch {
        setOrders([]);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="section-title">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="card flex min-h-28 flex-col justify-between p-5"><p className="text-sm">Total Users</p><p className="text-2xl font-bold">{users.length}</p></div>
        <div className="card flex min-h-28 flex-col justify-between p-5"><p className="text-sm">Total Products</p><p className="text-2xl font-bold">{products.length}</p></div>
        <div className="card flex min-h-28 flex-col justify-between p-5"><p className="text-sm">Transactions</p><p className="text-2xl font-bold">{orders.length}</p></div>
      </div>

      <section className="card p-5 md:p-6">
        <h2 className="mb-3 text-lg font-semibold text-tribal-800">View All Users</h2>
        {usersLoading ? (
          <p className="text-sm text-tribal-700">Loading users...</p>
        ) : usersError ? (
          <p className="text-sm text-red-600">{usersError}</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-tribal-700">No users found.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {users.map((user) => (
              <li key={user.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-tribal-100 pb-2">
                <span className="break-words">{user.name}</span>
                <span className="font-medium">{user.role}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card p-5 md:p-6">
        <h2 className="mb-3 text-lg font-semibold text-tribal-800">View All Products</h2>
        <ul className="space-y-2 text-sm">
          {products.map((product) => (
            <li key={product.id} className="flex flex-wrap items-center justify-between gap-2 border-b border-tribal-100 pb-2">
              <span className="break-words">{product.name}</span>
              <span>${product.price}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="card p-5 md:p-6">
        <h2 className="mb-3 text-lg font-semibold text-tribal-800">Customer Reviews</h2>
        <p className="text-sm text-tribal-700">Total reviews: {reviews.length}</p>
      </section>
    </div>
  );
}

export default AdminDashboard;
