import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

function MyProductsPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await API.get('/products');
        setProducts(response.data?.data || []);
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 'Unable to load your products right now.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const list = useMemo(
    () => products.filter((product) => Number(product.artisanId) === Number(user?.id)).slice(0, 10),
    [products, user]
  );

  return (
    <div className="space-y-5">
      <h1 className="section-title">My Listed Products</h1>
      {errorMessage ? <div className="card text-sm text-red-700">{errorMessage}</div> : null}
      {isLoading ? (
        <div className="card loading-state">
          <span className="loading-spinner" aria-hidden="true" />
          <span>Loading your products...</span>
        </div>
      ) : null}
      {!isLoading && list.length === 0 ? <div className="card">No products listed yet.</div> : null}
      {!isLoading && list.map((product) => (
        <div key={product.id} className="card flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <div>
            <h3 className="font-semibold text-tribal-800">{product.name}</h3>
            <p className="text-sm text-tribal-700">${product.price}</p>
          </div>
          <Link to={`/artisan/edit-product/${product.id}`} className="btn-secondary">
            Edit Product
          </Link>
        </div>
      ))}
    </div>
  );
}

export default MyProductsPage;
