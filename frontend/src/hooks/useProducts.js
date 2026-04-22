import { useState, useEffect } from 'react';
import API from '../api/axios';

/**
 * useProducts — fetches all products OR a single product by id
 * @param {string|null} productId  — pass null for all products
 */
const useProducts = (productId = null) => {
  const [products, setProducts] = useState([]);
  const [product,  setProduct]  = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (productId) {
          const { data } = await API.get(`/products/${productId}`);
          if (!cancelled) setProduct(data);
        } else {
          const { data } = await API.get('/products');
          if (!cancelled) setProducts(data);
        }
      } catch (err) {
        if (!cancelled) setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchData();
    return () => { cancelled = true; };
  }, [productId]);

  return { products, product, loading, error };
};

export default useProducts;
