import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

function ReviewsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState('');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await API.get('/products');
        const loadedProducts = response.data?.data || [];
        setProducts(loadedProducts);
        if (loadedProducts.length > 0) {
          setSelectedProductId(String(loadedProducts[0].id));
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Unable to load products for review.');
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedProductId) return;
      try {
        const response = await API.get(`/reviews/product/${selectedProductId}`);
        setHistory((response.data?.data || []).slice(0, 5));
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Unable to load reviews right now.');
      }
    };

    fetchReviews();
  }, [selectedProductId, message]);

  const submitReview = async (event) => {
    event.preventDefault();
    setMessage('');
    setErrorMessage('');

    try {
      await API.post('/reviews', {
        productId: Number(selectedProductId),
        userId: user?.id,
        rating,
        comment: review.trim(),
      });
      setMessage('Review submitted.');
      setReview('');
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Unable to submit review right now.');
    }
  };

  return (
    <div className="mx-auto max-w-2xl card space-y-4">
      <h1 className="section-title">Leave a Review</h1>
      {message ? <p className="text-sm text-green-700">{message}</p> : null}
      {errorMessage ? <p className="text-sm text-red-700">{errorMessage}</p> : null}
      <form onSubmit={submitReview} className="space-y-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Product</label>
          <select
            value={selectedProductId}
            onChange={(event) => setSelectedProductId(event.target.value)}
            className="rounded border border-tribal-300 px-3 py-2"
            required
          >
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Rating</label>
          <select value={rating} onChange={(event) => setRating(Number(event.target.value))} className="rounded border border-tribal-300 px-3 py-2">
            {[5, 4, 3, 2, 1].map((star) => (
              <option key={star} value={star}>{star} Stars</option>
            ))}
          </select>
        </div>
        <textarea
          value={review}
          onChange={(event) => setReview(event.target.value)}
          required
          rows="4"
          className="w-full rounded border border-tribal-300 px-3 py-2"
          placeholder="Share your experience"
        />
        <button type="submit" className="btn-primary">Submit Review</button>
      </form>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-tribal-800">Recent Reviews</h2>
        {history.length === 0 ? <p className="text-sm text-tribal-700">No reviews yet.</p> : null}
        {history.map((item) => (
          <div key={item.id} className="rounded border border-tribal-200 px-3 py-2 text-sm">
            <p className="font-medium">{item.rating}/5</p>
            <p className="text-tribal-700">{item.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReviewsPage;
