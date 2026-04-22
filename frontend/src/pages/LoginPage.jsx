import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css';

const LoginPage = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect back to where the user came from (e.g. /checkout)
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }
    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }
    return errs;
  };

  /* ── Handlers ── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="auth-page" id="login-page">
      <div className="auth-card">

        {/* Logo */}
        <Link to="/" className="auth-logo" aria-label="Go to homepage">
          <span className="auth-logo-main">amazon</span>
          <span className="auth-logo-dot">.</span>
          <span className="auth-logo-clone">clone</span>
        </Link>

        <h1 className="auth-title">Sign In</h1>

        {/* Server error */}
        {serverError && (
          <div className="alert alert-error" role="alert" id="login-server-error">
            <span className="alert-icon">⚠</span> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate id="login-form" className="auth-form">

          {/* Email */}
          <div className="form-group">
            <label htmlFor="login-email" className="form-label">Email address</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              autoFocus
              value={form.email}
              onChange={handleChange}
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="you@example.com"
              aria-describedby={errors.email ? 'email-error' : undefined}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <span id="email-error" className="form-error" role="alert">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <div className="auth-label-row">
              <label htmlFor="login-password" className="form-label">Password</label>
              <Link to="#" className="auth-forgot" tabIndex={0}>
                Forgot password?
              </Link>
            </div>
            <div className="auth-input-wrap">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="At least 6 characters"
                aria-describedby={errors.password ? 'password-error' : undefined}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                id="toggle-password-btn"
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && (
              <span id="password-error" className="form-error" role="alert">
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="login-submit-btn"
            className="btn btn-primary btn-full auth-submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading
              ? <><span className="btn-spinner" aria-hidden="true" /> Signing in…</>
              : 'Sign In'}
          </button>
        </form>

        {/* Terms */}
        <p className="auth-terms">
          By continuing, you agree to Amazon Clone's{' '}
          <Link to="#" className="auth-terms-link">Conditions of Use</Link> and{' '}
          <Link to="#" className="auth-terms-link">Privacy Notice</Link>.
        </p>

        <div className="auth-divider">
          <span>New to Amazon Clone?</span>
        </div>

        <Link to="/signup" id="create-account-btn" className="btn btn-secondary btn-full auth-create-btn">
          Create your Amazon account
        </Link>
      </div>
    </div>
  );
};

export default LoginPage;
