import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating';
import Spinner from '../components/Spinner';
import './ProductDetailPage.css';

/* Deterministic mock rating from product _id */
const mockRating = (id = '') => {
  const code = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return parseFloat((3.5 + (code % 4) * 0.5).toFixed(1));
};
const mockCount = (id = '') => {
  const code = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return 50 + (code % 900);
};

const ProductDetailPage = () => {
  const { id }                = useParams();
  const navigate              = useNavigate();
  const { product, loading, error } = useProducts(id);
  const { addToCart, cartItems }    = useCart();

  const [qty, setQty]         = useState(1);
  const [added, setAdded]     = useState(false);

  if (loading) return <Spinner size="lg" text="Loading product…" />;

  if (error) return (
    <div className="pdp-error container" id="pdp-error">
      <div className="alert alert-error">⚠ {error}</div>
      <button className="btn btn-secondary" onClick={() => navigate('/')}>
        ← Back to Home
      </button>
    </div>
  );

  if (!product) return null;

  const rating       = mockRating(product._id);
  const reviewCount  = mockCount(product._id);
  const inCart       = cartItems.find((i) => i._id === product._id);
  const inStock      = true; // backend doesn't track stock yet

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  return (
    <div className="pdp container" id="pdp-page">

      {/* ── Breadcrumb ──────────────────────────────────────── */}
      <nav className="pdp__breadcrumb" aria-label="Breadcrumb">
        <button className="pdp__breadcrumb-link" onClick={() => navigate('/')}>Home</button>
        <span className="pdp__breadcrumb-sep">›</span>
        <button
          className="pdp__breadcrumb-link"
          onClick={() => navigate(`/?search=${encodeURIComponent(product.category)}`)}
        >
          {product.category}
        </button>
        <span className="pdp__breadcrumb-sep">›</span>
        <span className="pdp__breadcrumb-current">{product.title}</span>
      </nav>

      <div className="pdp__layout">

        {/* ── Image Panel ─────────────────────────────────── */}
        <div className="pdp__image-panel">
          <div className="pdp__image-wrap">
            <img
              src={product.image}
              alt={product.title}
              className="pdp__image"
              id="pdp-product-image"
            />
          </div>
          {/* Thumbnail strip (same image repeated as placeholder) */}
          <div className="pdp__thumbs" aria-label="Product image thumbnails">
            {[0, 1, 2].map((i) => (
              <button key={i} className={`pdp__thumb ${i === 0 ? 'active' : ''}`}>
                <img src={product.image} alt={`View ${i + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Info Panel ──────────────────────────────────── */}
        <div className="pdp__info">
          <p className="pdp__category">{product.category}</p>
          <h1 className="pdp__title" id="pdp-product-title">{product.title}</h1>

          {/* Rating row */}
          <div className="pdp__rating-row">
            <StarRating rating={rating} count={reviewCount} />
            <span className="pdp__rating-sep">|</span>
            <span className="pdp__rating-score">{rating} out of 5</span>
          </div>

          <hr className="pdp__divider" />

          {/* Price */}
          <div className="pdp__price-block">
            <span className="pdp__price-label">Price: </span>
            <span className="pdp__price" id="pdp-price">
              <sup className="pdp__currency">$</sup>
              {product.price.toFixed(2)}
            </span>
          </div>

          {/* In stock */}
          <p className={`pdp__stock ${inStock ? 'in-stock' : 'out-stock'}`}>
            {inStock ? '✔ In Stock' : '✘ Out of Stock'}
          </p>

          {/* Description */}
          <div className="pdp__desc-block">
            <h2 className="pdp__desc-title">About this item</h2>
            <p className="pdp__desc">{product.description}</p>
          </div>

          <hr className="pdp__divider" />

          {/* Quantity + Add to Cart */}
          <div className="pdp__actions">
            <div className="pdp__qty-row">
              <label htmlFor="pdp-qty" className="pdp__qty-label">Qty:</label>
              <div className="pdp__qty-control">
                <button
                  className="pdp__qty-btn"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  id="pdp-qty-dec"
                  aria-label="Decrease quantity"
                  disabled={qty <= 1}
                >−</button>
                <span className="pdp__qty-val" id="pdp-qty" aria-live="polite">{qty}</span>
                <button
                  className="pdp__qty-btn"
                  onClick={() => setQty((q) => Math.min(10, q + 1))}
                  id="pdp-qty-inc"
                  aria-label="Increase quantity"
                  disabled={qty >= 10}
                >+</button>
              </div>
              {inCart && (
                <span className="pdp__in-cart-badge">🛒 {inCart.quantity} in cart</span>
              )}
            </div>

            {/* Success flash */}
            {added && (
              <div className="alert alert-success pdp__added-alert" role="status" aria-live="polite">
                ✓ Added {qty} item{qty > 1 ? 's' : ''} to your cart!
              </div>
            )}

            <button
              className="btn btn-primary btn-full btn-lg pdp__add-btn"
              onClick={handleAddToCart}
              id="pdp-add-to-cart"
              disabled={!inStock}
              aria-label={`Add ${qty} of ${product.title} to cart`}
            >
              🛒 Add to Cart
            </button>

            <button
              className="btn btn-secondary btn-full btn-lg pdp__buy-btn"
              onClick={handleBuyNow}
              id="pdp-buy-now"
              disabled={!inStock}
            >
              ⚡ Buy Now
            </button>
          </div>

          {/* Delivery info */}
          <div className="pdp__delivery">
            <div className="pdp__delivery-item">
              <span className="pdp__delivery-icon">🚚</span>
              <div>
                <p className="pdp__delivery-label">FREE Delivery</p>
                <p className="pdp__delivery-sub">On orders over $25</p>
              </div>
            </div>
            <div className="pdp__delivery-item">
              <span className="pdp__delivery-icon">↩</span>
              <div>
                <p className="pdp__delivery-label">30-Day Returns</p>
                <p className="pdp__delivery-sub">Easy hassle-free returns</p>
              </div>
            </div>
            <div className="pdp__delivery-item">
              <span className="pdp__delivery-icon">🔒</span>
              <div>
                <p className="pdp__delivery-label">Secure Payment</p>
                <p className="pdp__delivery-sub">SSL encrypted checkout</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
