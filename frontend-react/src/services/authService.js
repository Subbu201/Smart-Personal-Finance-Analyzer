// Authentication Service - Direct login/signup (no OTP)

class AuthService {
  constructor() {
    this.API_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080/api';
    console.log('AuthService initialized with API_URL:', this.API_URL);
    console.log('Environment REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
  }

  // Sign Up - Create new user immediately
  async signUp(userData) {
    try {
      const { email, password, fullName } = userData;
      
      if (!email || !password || !fullName) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, fullName })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Sign up failed');
      }

      // Store user info (but NOT authenticated yet - no token)
      if (data.user) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // IMPORTANT: Registration does NOT authenticate user
      // User must verify OTP first to get a token
      sessionStorage.setItem('registrationPending', 'true');
      sessionStorage.removeItem('auth_token');
      sessionStorage.setItem('isAuthenticated', 'false');

      return {
        success: true,
        user: data.user,
        token: data.token,
        requiresOtpVerification: true
      };
    } catch (error) {
      throw new Error(error.message || 'Sign up failed');
    }
  }

  // Login
  async login(credentials) {
    try {
      const { email, password } = credentials;

      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      console.log('Login attempt - making request to:', `${this.API_URL}/auth/login`);
      
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      console.log('Login response status:', response.status);
      
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // Store user
      if (data.user) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }
      
      // Only authenticate if we have a valid token
      if (data.token) {
        sessionStorage.setItem('auth_token', data.token);
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.removeItem('registrationPending');
        console.log('Login successful - Token stored:', data.token ? 'Yes' : 'No');
      } else {
        sessionStorage.removeItem('auth_token');
        sessionStorage.setItem('isAuthenticated', 'false');
        console.log('No token in response');
      }

      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  // Verify OTP after registration
  async verifyOtp(verifyData) {
    try {
      const { email, otp } = verifyData;

      if (!email || !otp) {
        throw new Error('Email and OTP are required');
      }

      const response = await fetch(`${this.API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'OTP verification failed');
      }

      // After successful OTP verification, user is authenticated
      if (data.user) {
        sessionStorage.setItem('user', JSON.stringify(data.user));
      }
      if (data.token) {
        sessionStorage.setItem('auth_token', data.token);
        sessionStorage.setItem('isAuthenticated', 'true');
        sessionStorage.removeItem('registrationPending');
        console.log('OTP Verification successful - Token stored:', data.token ? 'Yes' : 'No');
      }

      return {
        success: true,
        user: data.user,
        token: data.token
      };
    } catch (error) {
      throw new Error(error.message || 'OTP verification failed');
    }
  }

  // Resend OTP for registration
  async resendOtp(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const response = await fetch(`${this.API_URL}/auth/resend-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to resend OTP');
      }

      return { success: true, message: data.message };
    } catch (error) {
      throw new Error(error.message || 'Resend OTP failed');
    }
  }

  // Forgot password - request OTP
  async forgotPassword(email) {
    try {
      if (!email) {
        throw new Error('Email is required');
      }

      const response = await fetch(`${this.API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Failed to send password reset OTP');
      }

      return { success: true, message: data.message };
    } catch (error) {
      throw new Error(error.message || 'Forgot password failed');
    }
  }

  // Reset password with OTP
  async resetPassword(resetData) {
    try {
      const { email, otp, newPassword } = resetData;

      if (!email || !otp || !newPassword) {
        throw new Error('Email, OTP, and new password are required');
      }

      if (newPassword.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const response = await fetch(`${this.API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword })
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Password reset failed');
      }

      return { success: true, message: data.message };
    } catch (error) {
      throw new Error(error.message || 'Password reset failed');
    }
  }


  // Logout
  logout() {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('auth_token');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('registrationPending');
    return { success: true };
  }

  getCurrentUser() {
    try {
      const user = sessionStorage.getItem('user');
      // Handle null, undefined, or the string "undefined"
      if (!user || user === 'undefined') {
        return null;
      }
      return JSON.parse(user);
    } catch (error) {
      console.error('Error parsing user from session:', error);
      // Clear the corrupted data
      sessionStorage.removeItem('user');
      return null;
    }
  }

  isAuthenticated() {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }

  getAuthToken() {
    return sessionStorage.getItem('auth_token');
  }

  restoreSession() {
    const isAuth = this.isAuthenticated();
    const user = this.getCurrentUser();
    return { isAuthenticated: isAuth, user };
  }
}

export default new AuthService();
