import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/?search=${encodeURIComponent(query.trim())}`);
    else navigate(`/`);
  };

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="navbar" id="main-navbar">
      <div className="navbar__top">
        {/* Logo */}
        <Link to="/" className="navbar__logo" id="nav-logo" aria-label="Amazon Clone Home">
          <span className="navbar__logo-text">amazon</span>
          <span className="navbar__logo-dot">.</span>
          <span className="navbar__logo-clone">clone</span>
        </Link>



        {/* Search Bar */}
        <form className="navbar__search" onSubmit={handleSearch} role="search">

          <input
            id="nav-search-input"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="navbar__search-input"
            aria-label="Search products"
          />
          <button type="submit" className="navbar__search-btn" id="nav-search-btn" aria-label="Search">
            🔍
          </button>
        </form>

        {/* Auth / Account */}
        <div className="navbar__account" ref={dropdownRef}>
          <button
            className="navbar__account-btn"
            id="nav-account-btn"
            onClick={() => setDropdownOpen((v) => !v)}
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <span className="navbar__account-label">
              {user ? `Hello, ${user?.name?.split(' ')[0] || 'User'}` : 'Hello, sign in'}
            </span>
            <span className="navbar__account-bold">Account &amp; Lists <span className="nav-caret">▾</span></span>
          </button>

          {dropdownOpen && (
            <div className="navbar__dropdown" role="menu">
              {!user ? (
                <>
                  <Link to="/login" className="btn btn-primary btn-full" id="nav-signin-btn" onClick={() => setDropdownOpen(false)}>
                    Sign In
                  </Link>
                  <p className="navbar__dropdown-new">
                    New customer? <Link to="/signup" className="navbar__dropdown-link" onClick={() => setDropdownOpen(false)}>Start here.</Link>
                  </p>
                </>
              ) : (
                <>
                  <p className="navbar__dropdown-name">Signed in as <strong>{user.name}</strong></p>
                  <hr className="divider" />
                  <button className="navbar__dropdown-item" role="menuitem" onClick={handleLogout} id="nav-logout-btn">
                    Sign Out
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Returns & Orders (Hidden on Mobile) */}
        <Link to="#" className="navbar__returns nav-hide-mobile">
          <span className="navbar__returns-label">Returns</span>
          <span className="navbar__returns-bold">&amp; Orders</span>
        </Link>

        {/* Cart */}
        <Link to="/cart" className="navbar__cart" id="nav-cart-btn" aria-label={`Cart with ${totalItems} items`}>
          <div className="navbar__cart-icon-wrap">
            <span className="navbar__cart-icon">🛒</span>
            <span className="navbar__cart-count" aria-live="polite">{totalItems}</span>
          </div>
          <span className="navbar__cart-label nav-hide-mobile">Cart</span>
        </Link>
      </div>


    </header>
  );
};

export default Navbar;
