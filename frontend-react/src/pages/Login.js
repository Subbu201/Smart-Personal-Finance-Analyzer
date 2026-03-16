import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Auth.css';

function Login() {
  const navigate = useNavigate();
  const { login: setAuthUser } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    // Check remember me
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) {
      setFormData(prev => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    if (!formData.password.trim()) {
      setError('Password is required');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await authService.login({
        email: formData.email,
        password: formData.password
      });

      if (response.success) {
        // Update AuthContext
        setAuthUser(response.user);

        // Handle remember me
        if (rememberMe) {
          localStorage.setItem('rememberedEmail', formData.email);
        } else {
          localStorage.removeItem('rememberedEmail');
        }

        // Redirect to dashboard
        navigate('/');
      }
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
              <h2>Welcome Back!</h2>
              <p>Sign in to your Smart Finance account</p>
            </div>

            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleLogin}>
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
                  placeholder="Enter your password"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              <div className="form-options">
                <label className="remember-me">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>
                <a href="/forgot-password" className="forgot-password">Forgot password?</a>
              </div>

              <button 
                type="submit" 
                className="auth-btn auth-btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Signing In...
                  </>
                ) : (
                  <>
                    <span>➜</span>
                    Sign In
                  </>
                )}
              </button>
            </form>

            <div className="auth-divider">
              <span>Don't have an account?</span>
            </div>

            <button 
              type="button"
              className="auth-btn auth-btn-secondary"
              onClick={() => navigate('/signin')}
              disabled={loading}
            >
              Create New Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
