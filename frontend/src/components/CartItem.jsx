import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { removeFromCart, updateQuantity } = useCart();

  return (
    <div className="cart-item" id={`cart-item-${item._id}`}>
      {/* Thumbnail */}
      <Link to={`/product/${item._id}`} className="cart-item__img-wrap">
        <img
          src={item.image}
          alt={item.title}
          className="cart-item__img"
          loading="lazy"
        />
      </Link>

      {/* Info */}
      <div className="cart-item__info">
        <Link to={`/product/${item._id}`} className="cart-item__title">
          {item.title}
        </Link>
        <p className="cart-item__category">{item.category}</p>
        <p className="cart-item__stock in-stock">✔ In Stock</p>
        <button
          className="cart-item__remove"
          onClick={() => removeFromCart(item._id)}
          id={`remove-${item._id}`}
          aria-label={`Remove ${item.title} from cart`}
        >
          Delete
        </button>
      </div>

      {/* Qty control */}
      <div className="cart-item__qty" role="group" aria-label="Quantity">
        <button
          className="cart-qty-btn"
          onClick={() => updateQuantity(item._id, item.quantity - 1)}
          id={`dec-${item._id}`}
          aria-label={item.quantity === 1 ? 'Remove item' : 'Decrease quantity'}
        >
          {item.quantity === 1 ? '🗑' : '−'}
        </button>
        <span className="cart-qty-val" aria-live="polite">{item.quantity}</span>
        <button
          className="cart-qty-btn"
          onClick={() => updateQuantity(item._id, item.quantity + 1)}
          id={`inc-${item._id}`}
          aria-label="Increase quantity"
          disabled={item.quantity >= 10}
        >
          +
        </button>
      </div>

      {/* Unit price */}
      <div className="cart-item__price right">
        ${item.price.toFixed(2)}
      </div>

      {/* Subtotal */}
      <div className="cart-item__subtotal right">
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      {/* Remove (icon for mobile) */}
      <button
        className="cart-item__remove-icon"
        onClick={() => removeFromCart(item._id)}
        aria-label={`Remove ${item.title}`}
      >
        ✕
      </button>
    </div>
  );
};

export default CartItem;
