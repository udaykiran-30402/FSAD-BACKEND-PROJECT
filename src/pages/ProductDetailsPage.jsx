import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';
import ProductImage from '../components/ProductImage';
import { createOrder } from '../services/orderService';
import API from '../utils/api';

function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [orderMessage, setOrderMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setIsLoading(true);
        const response = await API.get(`/products/${id}`);
        setProduct(response.data?.data || null);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Unable to load product details right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      setOrderMessage('Only customers can place orders.');
      return;
    }

    setOrderMessage('');
    setIsPaymentModalOpen(true);
  };

  const placeOrder = async () => {
    if (!product || !user) {
      return;
    }

    try {
      setIsSubmittingOrder(true);
      await createOrder({
        userId: user.id,
        productId: product.id,
        quantity: 1,
        totalPrice: product.price,
      });
      setOrderMessage('Order placed successfully');
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error(error);
      setOrderMessage('Unable to place order right now.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  if (!product) {
    return (
      <div className="card">
        {isLoading ? (
          <div className="loading-state">
            <span className="loading-spinner" aria-hidden="true" />
            <span>Loading product...</span>
          </div>
        ) : (
          <h1 className="text-xl font-bold">{errorMessage || 'Product not found.'}</h1>
        )}
        <Link to="/products" className="btn-secondary mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={placeOrder}
        product={product}
        submitting={isSubmittingOrder}
      />
      <ProductImage src={product.image} alt={product.name} className="h-80 w-full rounded-xl object-cover" />
      <div className="card space-y-3">
        <h1 className="text-3xl font-bold text-tribal-800">{product.name}</h1>
        <p className="text-tribal-700">{product.description}</p>
        <p className="text-sm text-tribal-600">Category: {product.category}</p>
        <p className="text-sm text-tribal-600">Artisan ID: {product.artisanId}</p>
        <p className="text-2xl font-bold text-tribal-700">${product.price}</p>
        {orderMessage ? <p className="text-sm text-[var(--tc-accent)]">{orderMessage}</p> : null}
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={handleBuyNow} className="btn-primary">
            Buy Now
          </button>
          <Link to="/products" className="btn-secondary inline-block">
            Back
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProductDetailsPage;
