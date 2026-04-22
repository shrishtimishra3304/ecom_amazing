import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart from backend when user logs in
  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setCartItems([]);
        return;
      }
      try {
        const { data } = await API.get('/cart');
        // Transform backend response to match frontend expectations
        // Backend returns: [{ product: { _id, title, price... }, quantity: 1 }]
        const formattedCart = data
          .filter(item => item.product) // safeguard against null products
          .map(item => ({
            ...item.product,
            quantity: item.quantity
          }));
        setCartItems(formattedCart);
      } catch (err) {
        console.error('Failed to fetch cart', err);
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (item) => {
    // Optimistic UI update
    setCartItems(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) return prev.map(i => i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });

    // Send to backend
    if (user) {
      try {
        await API.post('/cart', { productId: item._id });
      } catch (err) {
        console.error('Failed to add to backend cart', err);
      }
    }
  };

  const removeFromCart = async (id) => {
    // Optimistic UI update
    setCartItems(prev => prev.filter(i => i._id !== id));

    // Send to backend
    if (user) {
      try {
        await API.delete(`/cart/${id}`);
      } catch (err) {
        console.error('Failed to remove from backend cart', err);
      }
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return removeFromCart(id);
    
    // Optimistic UI update
    setCartItems(prev => prev.map(i => i._id === id ? { ...i, quantity } : i));

    // Send to backend
    if (user) {
      try {
        await API.put(`/cart/${id}`, { quantity });
      } catch (err) {
        console.error('Failed to update backend cart quantity', err);
      }
    }
  };

  const clearCart = async () => {
    const itemsToClear = [...cartItems];
    // Optimistic UI update
    setCartItems([]);

    // Send to backend
    // Since backend lacks a clear-cart route, we delete items one by one
    if (user) {
      try {
        await Promise.all(itemsToClear.map(item => API.delete(`/cart/${item._id}`)));
      } catch (err) {
        console.error('Failed to clear backend cart', err);
      }
    }
  };

  const totalItems = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const totalPrice = cartItems.reduce((acc, i) => acc + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
