import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './LoginPage.css'; // shared auth styles

const SignupPage = () => {
  const { signup, loading } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors]       = useState({});
  const [serverError, setServerError] = useState('');
  const [showPw, setShowPw]       = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  /* ── Validation ─────────────────────────────────────────── */
  const validate = () => {
    const errs = {};

    if (!form.name.trim()) {
      errs.name = 'Full name is required';
    } else if (form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = 'Enter a valid email address';
    }

    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    } else if (!/[A-Z]/.test(form.password)) {
      errs.password = 'Password must contain at least one uppercase letter';
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Please confirm your password';
    } else if (form.confirmPassword !== form.password) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  };

  /* ── Password strength ──────────────────────────────────── */
  const getStrength = (pw) => {
    if (!pw) return { level: 0, label: '', color: '' };
    let score = 0;
    if (pw.length >= 6)  score++;
    if (pw.length >= 10) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { level: score, label: 'Weak',   color: '#e74c3c' };
    if (score <= 3) return { level: score, label: 'Fair',   color: '#f39c12' };
    return             { level: score, label: 'Strong', color: '#27ae60' };
  };
  const strength = getStrength(form.password);

  /* ── Handlers ───────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name])   setErrors((prev) => ({ ...prev, [name]: '' }));
    if (serverError)    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const result = await signup(form.name.trim(), form.email, form.password);
    if (result.success) {
      navigate('/');
    } else {
      setServerError(result.message);
    }
  };

  return (
    <div className="auth-page" id="signup-page">
      <div className="auth-card signup-card">

        {/* Logo */}
        <Link to="/" className="auth-logo" aria-label="Go to homepage">
          <span className="auth-logo-main">amazon</span>
          <span className="auth-logo-dot">.</span>
          <span className="auth-logo-clone">clone</span>
        </Link>

        <h1 className="auth-title">Create account</h1>

        {/* Server error */}
        {serverError && (
          <div className="alert alert-error" role="alert" id="signup-server-error">
            <span className="alert-icon">⚠</span> {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate id="signup-form" className="auth-form">

          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="signup-name" className="form-label">Your name</label>
            <input
              id="signup-name"
              name="name"
              type="text"
              autoComplete="name"
              autoFocus
              value={form.name}
              onChange={handleChange}
              className={`form-input ${errors.name ? 'error' : ''}`}
              placeholder="First and last name"
              aria-describedby={errors.name ? 'name-error' : undefined}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <span id="name-error" className="form-error" role="alert">
                {errors.name}
              </span>
            )}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="signup-email" className="form-label">Email address</label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="email"
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
            <label htmlFor="signup-password" className="form-label">Password</label>
            <div className="auth-input-wrap">
              <input
                id="signup-password"
                name="password"
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? 'error' : ''}`}
                placeholder="At least 6 characters"
                aria-describedby="password-strength"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowPw((v) => !v)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                id="toggle-pw-btn"
              >
                {showPw ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && (
              <span id="signup-pw-error" className="form-error" role="alert">
                {errors.password}
              </span>
            )}
            {/* Strength meter */}
            {form.password && (
              <div className="pw-strength" id="password-strength" aria-live="polite">
                <div className="pw-strength-bar">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <div
                      key={n}
                      className="pw-strength-seg"
                      style={{
                        background: n <= strength.level ? strength.color : '#e0e0e0',
                      }}
                    />
                  ))}
                </div>
                <span className="pw-strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="signup-confirm-password" className="form-label">
              Re-enter password
            </label>
            <div className="auth-input-wrap">
              <input
                id="signup-confirm-password"
                name="confirmPassword"
                type={showConfirmPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                placeholder="Confirm your password"
                aria-describedby={errors.confirmPassword ? 'confirm-pw-error' : undefined}
                aria-invalid={!!errors.confirmPassword}
              />
              <button
                type="button"
                className="auth-toggle-pw"
                onClick={() => setShowConfirmPw((v) => !v)}
                aria-label={showConfirmPw ? 'Hide confirm password' : 'Show confirm password'}
                id="toggle-confirm-pw-btn"
              >
                {showConfirmPw ? '🙈' : '👁'}
              </button>
            </div>
            {errors.confirmPassword && (
              <span id="confirm-pw-error" className="form-error" role="alert">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            id="signup-submit-btn"
            className="btn btn-primary btn-full auth-submit"
            disabled={loading}
            aria-busy={loading}
          >
            {loading
              ? <><span className="btn-spinner" aria-hidden="true" /> Creating account…</>
              : 'Create your Amazon account'}
          </button>
        </form>

        {/* Terms */}
        <p className="auth-terms">
          By creating an account, you agree to Amazon Clone's{' '}
          <Link to="#" className="auth-terms-link">Conditions of Use</Link> and{' '}
          <Link to="#" className="auth-terms-link">Privacy Notice</Link>.
        </p>

        <div className="auth-divider">
          <span>Already have an account?</span>
        </div>

        <Link to="/login" id="signin-link" className="btn btn-secondary btn-full auth-create-btn">
          Sign in instead
        </Link>
      </div>
    </div>
  );
};

export default SignupPage;
