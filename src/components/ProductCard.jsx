import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PaymentModal from './PaymentModal';
import { createOrder } from '../services/orderService';
import { getCart, saveCart } from '../utils/storage';
import ProductImage from './ProductImage';

function ProductCard({ product }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      setMessage('Only customers can add products to cart.');
      return;
    }

    const existing = getCart();
    const found = existing.find((item) => item.id === product.id);

    if (found) {
      found.quantity += 1;
    } else {
      existing.push({ ...product, quantity: 1 });
    }

    saveCart(existing);
    setMessage('Added to cart.');
  };

  const handleBuyNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      setMessage('Only customers can place orders.');
      return;
    }

    setMessage('');
    setIsPaymentModalOpen(true);
  };

  const placeOrder = async () => {
    if (!user) {
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
      setMessage('Order placed successfully');
      setIsPaymentModalOpen(false);
    } catch (error) {
      console.error(error);
      setMessage('Unable to place order right now.');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  const badges = [];
  if (Number(product.id) <= 4) badges.push('New');
  badges.push('Handmade');

  return (
    <motion.article
      className="card tribal-product-card group overflow-hidden p-0"
      whileHover={{ y: -8, scale: 1.015 }}
      transition={{ duration: 0.24 }}
    >
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={placeOrder}
        product={product}
        submitting={isSubmittingOrder}
      />
      <div className="product-image-frame relative">
        <ProductImage
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={`${product.id}-${badge}`}
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${
                badge === 'New' ? 'bg-[var(--tc-highlight)] text-[#2b2109]' : 'bg-[var(--tc-accent)] text-white'
              }`}
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
      <div className="flex min-h-[280px] flex-col gap-2 p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--tc-primary)]">{product.category}</p>
        <h3 className="text-lg font-semibold text-[var(--tc-ink)]">{product.name}</h3>
        <p className="line-clamp-3 text-sm text-[var(--tc-muted)]">{product.description}</p>
        <p className="text-sm text-[var(--tc-accent)]">By {product.artisanName || `Artisan #${product.artisanId}`}</p>
        {message ? <p className="text-xs font-medium text-[var(--tc-accent)]">{message}</p> : null}
        <div className="mt-auto space-y-3 pt-2">
          <span className="price-highlight block text-xl font-bold">${product.price}</span>
          <div className="grid gap-2 sm:grid-cols-3">
            <Link to={`/products/${product.id}`} className="btn-secondary text-xs">
              Details
            </Link>
            <button type="button" onClick={handleBuyNow} className="btn-secondary text-xs">
              Buy Now
            </button>
            <button type="button" onClick={handleAddToCart} className="btn-primary text-xs">
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export default ProductCard;
