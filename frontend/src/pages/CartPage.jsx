import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import './CartPage.css';
const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();

  /* ── Empty State ────────────────────────────────────────── */
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty" id="cart-empty">
        <div className="cart-empty__icon">🛒</div>
        <h1 className="cart-empty__title">Your Amazon Cart is empty</h1>
        <p className="cart-empty__sub">
          You have no items in your shopping cart.
        </p>
        <Link to="/" className="btn btn-primary btn-lg" id="cart-shop-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  const savings     = totalPrice * 0.05;           // mock 5% discount display
  const orderTotal  = totalPrice - savings;

  return (
    <div className="cart-page container" id="cart-page">
      <h1 className="cart-page__title">Shopping Cart</h1>

      <div className="cart-layout">

        {/* ── Left: Items list ──────────────────────────────── */}
        <div className="cart-items" id="cart-items-list">

          {/* Header row */}
          <div className="cart-items__header">
            <span />
            <span className="cart-col-label">Product</span>
            <span className="cart-col-label center">Qty</span>
            <span className="cart-col-label right">Price</span>
            <span className="cart-col-label right">Subtotal</span>
            <span />
          </div>

          {/* Item rows */}
          {/* Item rows */}
          {cartItems.map((item) => (
            <CartItem key={item._id} item={item} />
          ))}

          {/* Cart actions */}
          <div className="cart-footer">
            <button
              className="btn btn-secondary cart-footer__clear"
              onClick={clearCart}
              id="clear-cart-btn"
            >
              🗑 Clear Cart
            </button>
            <Link to="/" className="btn btn-secondary" id="continue-shopping-btn">
              ← Continue Shopping
            </Link>
          </div>
        </div>

        {/* ── Right: Order Summary ──────────────────────────── */}
        <aside className="cart-summary" id="cart-summary" aria-label="Order summary">
          <h2 className="cart-summary__title">Order Summary</h2>

          <div className="cart-summary__rows">
            <div className="cart-summary__row">
              <span>Items ({totalItems})</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="cart-summary__row saving">
              <span>Savings (5%)</span>
              <span>−${savings.toFixed(2)}</span>
            </div>
            <div className="cart-summary__row">
              <span>Shipping</span>
              <span className="free-tag">FREE</span>
            </div>
          </div>

          <div className="cart-summary__divider" />

          <div className="cart-summary__total">
            <span>Order Total</span>
            <span id="cart-order-total">${orderTotal.toFixed(2)}</span>
          </div>

          <button
            className="btn btn-primary btn-full btn-lg cart-summary__checkout"
            onClick={() => navigate('/checkout')}
            id="proceed-to-checkout-btn"
          >
            Proceed to Checkout
          </button>

          {/* Trust badges */}
          <div className="cart-trust">
            <p className="cart-trust__item">🔒 SSL Secure Checkout</p>
            <p className="cart-trust__item">🚚 Free delivery on eligible orders</p>
            <p className="cart-trust__item">↩ Easy 30-day returns</p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
