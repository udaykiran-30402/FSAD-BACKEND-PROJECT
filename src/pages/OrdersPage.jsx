import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const getOrderNumber = (order) => order.orderNumber || `ORD-${order.id}`;
const getOrdersFromResponse = (response) => (Array.isArray(response.data) ? response.data : response.data?.data || []);

function OrdersPage() {
  const { user } = useAuth();
  const [allOrders, setAllOrders] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const response = await API.get('/orders');
        setAllOrders(getOrdersFromResponse(response));
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Unable to load orders right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const orders = useMemo(() => {
    if (user?.role === 'customer') {
      return allOrders.filter((order) => Number(order.userId) === Number(user.id));
    }
    return allOrders;
  }, [allOrders, user]);

  return (
    <div className="space-y-5">
      <h1 className="section-title">Orders</h1>
      {errorMessage ? <div className="card text-sm text-red-700">{errorMessage}</div> : null}
      {isLoading ? (
        <div className="card loading-state">
          <span className="loading-spinner" aria-hidden="true" />
          <span>Loading orders...</span>
        </div>
      ) : null}
      {!isLoading && orders.length === 0 ? <div className="card">No orders available.</div> : null}
      <div className="space-y-3">
        {!isLoading && orders.map((order) => (
          <article key={order.id} className="card flex flex-col justify-between gap-2 md:flex-row md:items-center">
            <div>
              <h3 className="font-semibold text-tribal-800">{getOrderNumber(order)}</h3>
              <p className="text-sm text-tribal-700">Created: {order.createdAt?.slice(0, 10) || 'N/A'}</p>
            </div>
            <div className="text-sm text-tribal-700">
              <p>Status: {order.status}</p>
              <p>Amount: ${order.totalPrice}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

export default OrdersPage;
