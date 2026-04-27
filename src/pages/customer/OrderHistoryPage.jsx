import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

const getOrderNumber = (order) => order.orderNumber || `ORD-${order.id}`;
const getOrdersFromResponse = (response) => (Array.isArray(response.data) ? response.data : response.data?.data || []);

function OrderHistoryPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadOrders();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);
      const res = await API.get('/orders');

      const userOrders = getOrdersFromResponse(res).filter((order) => Number(order.userId) === Number(user.id));

      setOrders(userOrders);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <h1 className="section-title">Order History</h1>

      {isLoading ? (
        <div className="card loading-state">
          <span className="loading-spinner" aria-hidden="true" />
          <span>Loading order history...</span>
        </div>
      ) : null}

      {!isLoading && orders.length === 0 && <div className="card">No orders yet.</div>}

      {!isLoading && orders.map((order) => (
        <div key={order.id} className="card">
          <h3 className="font-semibold text-tribal-800">{getOrderNumber(order)}</h3>
          <p>Status: {order.status}</p>
          <p>Quantity: {order.quantity}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderHistoryPage;
