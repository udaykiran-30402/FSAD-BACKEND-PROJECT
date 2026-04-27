import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getCart, saveCart } from '../../utils/storage';
import { createOrder } from '../../services/orderService';

function CheckoutPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const cart = getCart();

  const total = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);

  const placeOrder = async () => {
    try {
      setIsSubmitting(true);
      setErrorMessage('');
      await Promise.all(cart.map((item) => createOrder({
        userId: user?.id,
        productId: item.id,
        quantity: item.quantity,
        totalPrice: Number((item.price * item.quantity).toFixed(2)),
      })));
      saveCart([]);
      navigate('/customer/order-history');
    } catch {
      setErrorMessage('Unable to place order right now.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="checkout-shell card text-center">
        <p>No items in cart for checkout.</p>
        <Link to="/products" className="btn-secondary mt-3 inline-block">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="checkout-shell card space-y-5">
      <h1 className="section-title">Checkout</h1>
      <ul className="checkout-items text-sm">
        {cart.map((item) => (
          <li key={item.id} className="checkout-item-row">
            <span className="font-medium text-[var(--tc-ink)]">{item.name} x {item.quantity}</span>
            <span className="font-semibold text-[var(--tc-primary)]">${(item.price * item.quantity).toFixed(2)}</span>
          </li>
        ))}
      </ul>
      <div className="checkout-total">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      {errorMessage ? <p className="text-sm text-red-600">{errorMessage}</p> : null}
      <button type="button" onClick={placeOrder} className="btn-primary w-full px-6 py-3" disabled={isSubmitting}>
        {isSubmitting ? 'Placing...' : 'Place Order'}
      </button>
    </div>
  );
}

export default CheckoutPage;
