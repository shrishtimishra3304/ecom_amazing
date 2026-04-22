import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import useProducts from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import './HomePage.css';

/* ── Category chips derived from fetched products ───────── */
const ALL = 'All';

const HomePage = () => {
  const { products, loading, error } = useProducts();
  const [searchParams] = useSearchParams();
  const urlCategory = searchParams.get('category');
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';

  // Initialize activeCategory from URL if present, otherwise ALL
  const [activeCategory, setActiveCategory] = useState(urlCategory || ALL);

  // Sync activeCategory when URL changes
  useMemo(() => {
    if (urlCategory) setActiveCategory(urlCategory);
    else if (!searchParams.has('category')) setActiveCategory(ALL);
  }, [urlCategory, searchParams]);


  /* Derive unique categories from fetched data */
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))].sort();
    return [ALL, ...cats];
  }, [products]);

  /* Filter by category + search query */
  const filtered = useMemo(() => {
    const searchTerms = searchQuery ? searchQuery.split(/\s+/) : [];
    
    return products.filter((p) => {
      const matchCat = activeCategory === ALL || p.category === activeCategory;
      const matchSearch = searchTerms.length === 0 || searchTerms.every(term => 
        p.title.toLowerCase().includes(term) ||
        (p.description && p.description.toLowerCase().includes(term)) ||
        (p.category && p.category.toLowerCase().includes(term))
      );
      
      return matchCat && matchSearch;
    });
  }, [products, activeCategory, searchQuery]);

  return (
    <div className="home-page" id="home-page">

      {/* ── Hero Banner ────────────────────────────────────── */}
      <section className="hero" aria-label="Promotional banner">
        <div className="hero__content">
          <p className="hero__eyebrow">Welcome to</p>
          <h1 className="hero__title">Amazon Clone</h1>
          <p className="hero__subtitle">
            Millions of products · Unbeatable prices · Fast free delivery
          </p>
          <a href="#products-section" className="btn btn-primary btn-lg hero__cta">
            Shop Now
          </a>
        </div>
        <div className="hero__badge-group">
          <span className="hero__badge">🚀 Fast Delivery</span>
          <span className="hero__badge">🔒 Secure Checkout</span>
          <span className="hero__badge">↩ Easy Returns</span>
        </div>
      </section>

      {/* ── Category Filter ─────────────────────────────────── */}
      {!loading && !error && categories.length > 1 && (
        <section className="category-bar" aria-label="Filter by category">
          <div className="category-bar__inner">
            {categories.map((cat) => (
              <button
                key={cat}
                id={`category-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                className={`category-chip ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={activeCategory === cat}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ── Products Section ────────────────────────────────── */}
      <section className="products-section container" id="products-section" aria-label="Products">

        {/* Header row */}
        <div className="products-section__header">
          <h2 className="products-section__title">
            {searchQuery
              ? `Results for "${searchParams.get('search')}"`
              : activeCategory === ALL
              ? 'All Products'
              : activeCategory}
          </h2>
          {!loading && !error && (
            <span className="products-section__count">
              {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
            </span>
          )}
        </div>

        {/* States */}
        {loading && <Spinner size="lg" text="Loading products…" />}

        {error && (
          <div className="alert alert-error" role="alert" id="home-error">
            ⚠ {error}
          </div>
        )}

        {!loading && !error && filtered.length === 0 && (
          <div className="home-empty" id="home-empty">
            <p className="home-empty__icon">🔍</p>
            <h3 className="home-empty__title">No products found</h3>
            <p className="home-empty__sub">
              Try a different search or category.
            </p>
            <button
              className="btn btn-secondary"
              onClick={() => setActiveCategory(ALL)}
              id="clear-filter-btn"
            >
              Clear filter
            </button>
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="products-grid" id="products-grid">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
