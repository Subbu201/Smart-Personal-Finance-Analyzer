import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Auth.css';

function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login: setAuthUser } = useAuth();
  
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    // Get email from navigation state or session
    const emailFromState = location.state?.email;
    const emailFromSession = authService.getCurrentUser()?.email;
    const savedEmail = emailFromState || emailFromSession;
    
    if (savedEmail) {
      setEmail(savedEmail);
    }

    // Resend cooldown timer
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [location.state, resendCooldown]);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }

    if (!otp.trim()) {
      setError('Please enter the OTP');
      return;
    }

    if (otp.trim().length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.verifyOtp({
        email,
        otp: otp.trim()
      });

      if (response.success) {
        setSuccess(true);
        
        // Set the user in auth context
        setAuthUser(response.user);

        // Redirect to dashboard after successful verification
        setTimeout(() => {
          navigate('/');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call resend-otp endpoint
      const response = await authService.resendOtp(email);
      
      if (response.success) {
        setError(null);
        setOtp('');
        setResendCooldown(30); // 30 second cooldown
        alert('OTP resent successfully! Check your email.');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    setEmail('');
    setOtp('');
    setError(null);
    navigate('/signin');
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-box auth-success">
          <div className="success-icon">✅</div>
          <h2>Account Created Successfully!</h2>
          <p className="success-message">
            Your account has been created and verified<br />
            <strong>{email}</strong>
          </p>
          <p className="success-instruction">
            Redirecting to your dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-content">
        {/* Left Side - Info Section */}
        <div className="auth-info">
          <div className="auth-logo">
            <span className="logo-icon">💰</span>
          </div>
          <h1>Email Verification</h1>
          <p>Complete your account setup</p>
          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">✉️</span>
              <p>Check your email for OTP</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🔐</span>
              <p>Secure your account</p>
            </div>
            <div className="feature">
              <span className="feature-icon">✅</span>
              <p>Start managing finances</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="auth-form-container">
          <div className="auth-form">
            <h2>Verify Your Email</h2>
            <p className="form-subtitle">
              Enter the 6-digit OTP sent to <strong>{email}</strong>
            </p>

            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label htmlFor="otp">Enter OTP</label>
                <input
                  type="text"
                  id="otp"
                  placeholder="000000"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value);
                    setError(null);
                  }}
                  maxLength="6"
                  disabled={loading}
                  className="otp-input"
                />
                <small className="help-text">
                  ⏱️ OTP will expire in 5 minutes
                </small>
              </div>

              <button 
                type="submit" 
                className="auth-button" 
                disabled={loading || !otp.trim()}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <div className="auth-divider">or</div>

            <button 
              type="button"
              className="secondary-button"
              onClick={handleResendOtp}
              disabled={loading || resendCooldown > 0}
            >
              {resendCooldown > 0 
                ? `Resend OTP in ${resendCooldown}s` 
                : 'Resend OTP'}
            </button>

            <button 
              type="button"
              className="text-button"
              onClick={handleChangeEmail}
              disabled={loading}
            >
              Use different email
            </button>

            <div className="auth-footer">
              <p>
                Already verified? 
                <a href="/login" className="auth-link"> Login here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyOtp;
