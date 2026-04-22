import './StarRating.css';

/**
 * @param {number} rating  — e.g. 4.3
 * @param {number|null} count — review count, null hides it
 */
const StarRating = ({ rating = 4, count = null }) => {
  const stars = Array.from({ length: 5 }, (_, i) => {
    if (i + 1 <= Math.floor(rating)) return 'filled';
    if (i < rating)                  return 'half';
    return 'empty';
  });

  return (
    <div className="stars" aria-label={`Rated ${rating} out of 5 stars`}>
      {stars.map((type, i) => (
        <span key={i} className={`star star-${type}`} aria-hidden="true">★</span>
      ))}
      {count !== null && (
        <span className="rating-count">({count.toLocaleString()})</span>
      )}
    </div>
  );
};

export default StarRating;
