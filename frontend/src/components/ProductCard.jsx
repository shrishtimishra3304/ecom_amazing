import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import StarRating from './StarRating';
import './ProductCard.css';

// Deterministic mock rating from product id so it's stable across renders
const mockRating = (id = '') => {
  const code = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return parseFloat((3.5 + (code % 4) * 0.5).toFixed(1));
};
const mockCount = (id = '') => {
  const code = id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return 50 + (code % 900);
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault(); // don't navigate on button click
    addToCart(product);
  };

  const rating = mockRating(product._id);
  const count  = mockCount(product._id);

  return (
    <Link
      to={`/product/${product._id}`}
      className="product-card"
      id={`product-card-${product._id}`}
      aria-label={`View ${product.title}`}
    >
      <div className="product-card__img-wrap">
        <img
          src={product.image}
          alt={product.title}
          className="product-card__img"
          loading="lazy"
        />
      </div>

      <div className="product-card__body">
        <p className="product-card__category">{product.category}</p>
        <h3 className="product-card__title">{product.title}</h3>

        <StarRating rating={rating} count={count} />

        <div className="product-card__price-row">
          <span className="product-card__currency">$</span>
          <span className="product-card__price">{product.price.toFixed(2)}</span>
        </div>

        <p className="product-card__shipping">FREE delivery</p>

        <button
          className="btn btn-primary btn-full product-card__btn"
          onClick={handleAdd}
          id={`add-to-cart-${product._id}`}
          aria-label={`Add ${product.title} to cart`}
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;
