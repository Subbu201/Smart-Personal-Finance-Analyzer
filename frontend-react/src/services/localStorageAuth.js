// LocalStorage-based Authentication Service
// Stores user data and transactions locally for each user

class LocalStorageAuthService {
  constructor() {
    this.USERS_KEY = 'spfa_users'; // All registered users
    this.CURRENT_USER_KEY = 'spfa_current_user'; // Currently logged-in user
    this.AUTH_TOKEN_KEY = 'spfa_auth_token';
    this.IS_AUTHENTICATED_KEY = 'spfa_isAuthenticated';
  }

  /**
   * Get all users from localStorage
   */
  getAllUsers() {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : {};
  }

  /**
   * Sign Up - Create new user in localStorage
   */
  signUp(userData) {
    try {
      const { email, password, fullName } = userData;
      
      if (!email || !password || !fullName) {
        throw new Error('All fields are required');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Email validation
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('Invalid email format');
      }

      const users = this.getAllUsers();

      // Check if user already exists
      if (users[email]) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        fullName,
        password, // In production, this should be hashed
        createdAt: new Date().toISOString(),
        transactions: [], // User's transactions storage
      };

      users[email] = newUser;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

      // Auto-login after signup
      const token = `token_${Date.now()}`;
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify({
        id: newUser.id,
        email: newUser.email,
        fullName: newUser.fullName,
      }));
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
      localStorage.setItem(this.IS_AUTHENTICATED_KEY, 'true');

      return {
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
        },
        token,
      };
    } catch (error) {
      throw new Error(error.message || 'Sign up failed');
    }
  }

  /**
   * Login - Authenticate user
   */
  login(email, password) {
    try {
      if (!email || !password) {
        throw new Error('Email and password are required');
      }

      const users = this.getAllUsers();
      const user = users[email];

      if (!user || user.password !== password) {
        throw new Error('Invalid email or password');
      }

      // Create session token
      const token = `token_${Date.now()}`;
      localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify({
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      }));
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
      localStorage.setItem(this.IS_AUTHENTICATED_KEY, 'true');

      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
        token,
      };
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }

  /**
   * Logout - Clear current user session
   */
  logout() {
    localStorage.removeItem(this.CURRENT_USER_KEY);
    localStorage.removeItem(this.AUTH_TOKEN_KEY);
    localStorage.removeItem(this.IS_AUTHENTICATED_KEY);
    return { success: true };
  }

  /**
   * Get current logged-in user
   */
  getCurrentUser() {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  /**
   * Get current user's full profile with transactions
   */
  getCurrentUserProfile() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return null;

    const users = this.getAllUsers();
    const fullProfile = users[currentUser.email];
    return fullProfile || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return localStorage.getItem(this.IS_AUTHENTICATED_KEY) === 'true';
  }

  /**
   * Get auth token
   */
  getAuthToken() {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }
}

export default new LocalStorageAuthService();
