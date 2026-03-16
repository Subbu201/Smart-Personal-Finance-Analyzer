import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isAuthPage = ['/login', '/signin'].includes(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={isAuthenticated ? "/" : "/login"} className="navbar-logo">
          <span className="logo-icon">💰</span>
          Smart Finance
        </Link>
        
        {isAuthenticated && !isAuthPage && (
          <div className="nav-menu">
            <Link 
              to="/" 
              className={`nav-item ${isActive('/') ? 'active' : ''}`}
            >
              📊 Dashboard
            </Link>
            <Link 
              to="/calendar" 
              className={`nav-item ${isActive('/calendar') ? 'active' : ''}`}
            >
              📅 Calendar
            </Link>
            <Link 
              to="/analytics" 
              className={`nav-item ${isActive('/analytics') ? 'active' : ''}`}
            >
              📈 Analytics
            </Link>
            <Link 
              to="/transactions" 
              className={`nav-item ${isActive('/transactions') ? 'active' : ''}`}
            >
              💳 Transactions
            </Link>
            <Link 
              to="/add-transaction" 
              className="nav-item nav-add-btn"
            >
              ➕ Add Transaction
            </Link>
          </div>
        )}

        {isAuthenticated && (
          <div className="nav-user">
            <span className="user-name">👤 {user?.name || user?.fullName || 'User'}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
