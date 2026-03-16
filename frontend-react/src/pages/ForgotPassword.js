import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Auth.css';

function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // 'email' or 'reset'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Resend cooldown timer
  React.useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Email is required');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setStep('reset');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setResendCooldown(30);
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }

    if (otp.trim().length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await authService.resetPassword({
        email,
        otp: otp.trim(),
        newPassword
      });

      if (response.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      setError(err.message || 'Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword(email);
      
      if (response.success) {
        setOtp('');
        setResendCooldown(30);
        alert('OTP resent successfully! Check your email.');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-container">
        <div className="auth-box auth-success">
          <div className="success-icon">✅</div>
          <h2>Password Reset!</h2>
          <p className="success-message">
            Your password has been reset successfully
          </p>
          <p className="success-instruction">
            Redirecting to login page...
          </p>
        </div>
      </div>
    );
  }

  if (step === 'email') {
    return (
      <div className="auth-container">
        <div className="auth-content">
          {/* Left Side - Info Section */}
          <div className="auth-info">
            <div className="auth-logo">
              <span className="logo-icon">💰</span>
            </div>
            <h1>Forgot Password?</h1>
            <p>Reset your account password</p>
            <div className="auth-features">
              <div className="feature">
                <span className="feature-icon">📧</span>
                <p>Enter your email</p>
              </div>
              <div className="feature">
                <span className="feature-icon">🔑</span>
                <p>Receive password OTP</p>
              </div>
              <div className="feature">
                <span className="feature-icon">✅</span>
                <p>Create new password</p>
              </div>
            </div>
          </div>

          {/* Right Side - Form Section */}
          <div className="auth-form-container">
            <div className="auth-form">
              <h2>Recover Your Account</h2>
              <p className="form-subtitle">
                Enter your email to receive a password reset OTP
              </p>

              {error && <ErrorMessage message={error} />}

              <form onSubmit={handleRequestOtp}>
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError(null);
                    }}
                    disabled={loading}
                  />
                </div>

                <button 
                  type="submit" 
                  className="auth-button" 
                  disabled={loading || !email.trim()}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
              </form>

              <div className="auth-footer">
                <p>
                  Remember your password?
                  <a href="/login" className="auth-link"> Login here</a>
                </p>
              </div>
            </div>
          </div>
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
          <h1>Reset Your Password</h1>
          <p>Complete the verification process</p>
          <div className="auth-features">
            <div className="feature">
              <span className="feature-icon">✉️</span>
              <p>OTP sent to your email</p>
            </div>
            <div className="feature">
              <span className="feature-icon">🔐</span>
              <p>Create a new password</p>
            </div>
            <div className="feature">
              <span className="feature-icon">✅</span>
              <p>Login with new password</p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="auth-form-container">
          <div className="auth-form">
            <h2>Set New Password</h2>
            <p className="form-subtitle">
              Enter the OTP from your email and set a new password
            </p>

            {error && <ErrorMessage message={error} />}

            <form onSubmit={handleResetPassword}>
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

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  placeholder="New password (min 6 characters)"
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError(null);
                  }}
                  disabled={loading}
                />
              </div>

              <button 
                type="submit" 
                className="auth-button" 
                disabled={loading || !otp.trim() || !newPassword || !confirmPassword}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
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
              onClick={() => setStep('email')}
              disabled={loading}
            >
              Use different email
            </button>

            <div className="auth-footer">
              <p>
                No account?
                <a href="/signin" className="auth-link"> Sign up here</a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
