import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './CheckoutPage.css';

const CheckoutPage = () => {
  const { user } = useAuth();
  const { cartItems, totalPrice, totalItems, clearCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to login if not authenticated, saving the intent to return here
  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [user, navigate, location]);

  const [form, setForm] = useState({
    fullName: user ? user.name : '',
    address: '',
    city: '',
    zip: '',
    country: 'United States',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (isSuccess) {
    return (
      <div className="checkout-empty container">
        <div style={{ fontSize: '64px', color: '#007600', marginBottom: '10px' }}>✓</div>
        <h2>Order placed, thanks!</h2>
        <p>Confirmation will be sent to your email. Shipping details will be available shortly.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '20px' }}>Continue Shopping</Link>
      </div>
    );
  }

  // If cart is empty, user shouldn't be here
  if (cartItems.length === 0) {
    return (
      <div className="checkout-empty container">
        <h2>Your cart is empty.</h2>
        <p>Please add items to your cart before checking out.</p>
        <Link to="/" className="btn btn-primary">Return to Shop</Link>
      </div>
    );
  }

  const savings = totalPrice * 0.05;
  const shipping = 0; // Free shipping
  const tax = (totalPrice - savings) * 0.08; // 8% tax
  const orderTotal = totalPrice - savings + shipping + tax;

  const validate = () => {
    const errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.zip.trim()) errs.zip = 'ZIP code is required';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call for placing order
    setTimeout(() => {
      clearCart();
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 1500);
  };

  return (
    <div className="checkout-page container">
      <h1 className="checkout-title">Checkout ({totalItems} items)</h1>
      
      <div className="checkout-layout">
        {/* Left Column: Forms & Details */}
        <div className="checkout-main">
          
          {/* Section 1: Shipping Address */}
          <section className="checkout-section">
            <div className="checkout-section-header">
              <span className="checkout-step">1</span>
              <h2>Shipping address</h2>
            </div>
            
            <form id="checkout-address-form" className="checkout-form">
              <div className="form-group">
                <label className="form-label" htmlFor="fullName">Full name (First and Last name)</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-input ${errors.fullName ? 'error' : ''}`}
                  value={form.fullName}
                  onChange={handleChange}
                />
                {errors.fullName && <span className="form-error">{errors.fullName}</span>}
              </div>
              
              <div className="form-group">
                <label className="form-label" htmlFor="country">Country/Region</label>
                <select 
                  id="country" 
                  name="country" 
                  className="form-input"
                  value={form.country}
                  onChange={handleChange}
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="India">India</option>
                  <option value="Australia">Australia</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="address">Street address</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  className={`form-input ${errors.address ? 'error' : ''}`}
                  placeholder="Street address, P.O. box, company name, c/o"
                  value={form.address}
                  onChange={handleChange}
                />
                {errors.address && <span className="form-error">{errors.address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group half">
                  <label className="form-label" htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    value={form.city}
                    onChange={handleChange}
                  />
                  {errors.city && <span className="form-error">{errors.city}</span>}
                </div>
                
                <div className="form-group half">
                  <label className="form-label" htmlFor="zip">ZIP Code</label>
                  <input
                    type="text"
                    id="zip"
                    name="zip"
                    className={`form-input ${errors.zip ? 'error' : ''}`}
                    value={form.zip}
                    onChange={handleChange}
                  />
                  {errors.zip && <span className="form-error">{errors.zip}</span>}
                </div>
              </div>
            </form>
          </section>

          {/* Section 2: Payment Method (Mock) */}
          <section className="checkout-section">
            <div className="checkout-section-header">
              <span className="checkout-step">2</span>
              <h2>Payment method</h2>
            </div>
            <div className="checkout-payment-mock">
              <div className="payment-option selected">
                <input type="radio" id="card" name="payment" defaultChecked />
                <label htmlFor="card">
                  <strong>Credit or debit card</strong>
                  <div className="card-logos">
                    <span className="card-logo visa">Visa</span>
                    <span className="card-logo mc">Mastercard</span>
                    <span className="card-logo amex">Amex</span>
                  </div>
                </label>
              </div>
              <div className="payment-details">
                <p>Card ending in •••• 4242</p>
                <p>Billing address: Same as shipping address</p>
              </div>
            </div>
          </section>

          {/* Section 3: Review items */}
          <section className="checkout-section">
            <div className="checkout-section-header">
              <span className="checkout-step">3</span>
              <h2>Review items and shipping</h2>
            </div>
            
            <div className="checkout-items">
              <div className="checkout-delivery-date">
                <h3>Delivery: Tomorrow</h3>
                <p>Items shipped from Amazon Clone</p>
              </div>
              
              {cartItems.map((item) => (
                <div className="checkout-item" key={item._id}>
                  <div className="checkout-item-img-wrap">
                    <img src={item.image} alt={item.title} className="checkout-item-img" />
                  </div>
                  <div className="checkout-item-info">
                    <h4>{item.title}</h4>
                    <p className="checkout-item-price">${item.price.toFixed(2)}</p>
                    <p className="checkout-item-qty">Qty: {item.quantity}</p>
                    <p className="checkout-item-soldby">Sold by: Amazon Clone</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <div className="checkout-sidebar">
          <div className="checkout-summary-box">
            <button 
              className="btn btn-primary btn-full checkout-place-order-btn"
              onClick={handlePlaceOrder}
              disabled={isSubmitting}
            >
              {isSubmitting ? <><span className="btn-spinner"></span> Placing Order...</> : 'Place your order'}
            </button>
            <p className="checkout-terms">
              By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
            </p>
            
            <h3 className="summary-heading">Order Summary</h3>
            <div className="summary-row">
              <span>Items ({totalItems}):</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping & handling:</span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="summary-row discount">
              <span>Savings:</span>
              <span>-${savings.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Total before tax:</span>
              <span>${(totalPrice - savings + shipping).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Estimated tax to be collected:</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            
            <div className="summary-divider"></div>
            
            <div className="summary-total">
              <span>Order total:</span>
              <span>${orderTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
