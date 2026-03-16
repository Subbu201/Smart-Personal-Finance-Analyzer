import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Auth.css';

function SignIn() {
  const navigate = useNavigate();
  useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return false;
    }
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    return true;
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);
    try {
      await authService.signUp({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password
      });

      // Navigate directly to OTP verification page (no success message)
      navigate('/verify-otp', { state: { email: formData.email } });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Left Side - Info Section */}
        <div className="auth-info">
          <div className="auth-logo">
            <span className="logo-icon">💰</span>
          </div>
          <h1>Smart Finance</h1>
          <p>Your personal finance companion</p>
          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">📊</span>
              <p>Track your expenses</p>
            </div>
            <div className="feature">
              <span className="feature-icon">💡</span>
              <p>Get smart insights</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🎯</span>
              <p>Achieve your goals</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="auth-form-container">
          <div className="auth-box">
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Join our community of smart savers</p>
            </div>

            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleSignIn}>
              <div className="form-group">
                <label htmlFor="fullName">
                  <span className="label-icon">👤</span>
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="John Doe"
                  disabled={loading}
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">
                  <span className="label-icon">📧</span>
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">
                  <span className="label-icon">🔒</span>
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  disabled={loading}
                  autoComplete="new-password"
                />
                <small className="password-hint">Must be at least 6 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">
                  <span className="label-icon">✔️</span>
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              <button 
                type="submit" 
                className="auth-btn auth-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <span>➜</span>
                    Create Account
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>Already have an account?</span>
            </div>

            <button 
              type="button"
              className="auth-btn auth-btn-secondary"
              onClick={() => navigate('/login')}
              disabled={loading}
            >
              Sign In to Your Account
            </button>

            <p className="auth-terms">
              By creating an account, you agree to our Terms & Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
