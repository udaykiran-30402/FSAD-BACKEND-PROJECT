import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import API from '../../utils/api';

function AddProductPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    image: '',
    artisanId: '',
  });

  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user?.id) {
      setFormData((prev) => ({
        ...prev,
        artisanId: user.id
      }));
    }
  }, [user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setMessage('');
    setErrorMessage('');
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        price: Number(formData.price),
        image: formData.image,
        description: formData.description,
        artisanId: formData.artisanId
      };

      await API.post("/products", payload);

      setMessage("Product saved successfully");

      setFormData({
        name: '',
        category: '',
        price: '',
        description: '',
        image: '',
        artisanId: user?.id || ''
      });

      setTimeout(() => {
        navigate('/artisan/products');
      }, 700);

    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
        "Unable to save product right now."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl card">
      <h1 className="section-title">Add Product</h1>

      {message && (
        <p className="mt-2 text-sm text-green-700">
          {message}
        </p>
      )}

      {errorMessage && (
        <p className="mt-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-3">

        <input
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Product Name"
          className="w-full rounded border px-3 py-2"
        />

        <input
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          placeholder="Category"
          className="w-full rounded border px-3 py-2"
        />

        <input
          name="price"
          type="number"
          value={formData.price}
          onChange={handleChange}
          required
          placeholder="Price"
          className="w-full rounded border px-3 py-2"
        />

        <input
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
          placeholder="Image URL"
          className="w-full rounded border px-3 py-2"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows="4"
          placeholder="Description"
          className="w-full rounded border px-3 py-2"
        />

        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary"
        >
          {isSaving ? "Saving..." : "Save Product"}
        </button>

      </form>
    </div>
  );
}

export default AddProductPage;