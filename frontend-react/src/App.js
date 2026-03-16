import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import CalendarPage from './pages/CalendarPage';
import AnalyticsPage from './pages/AnalyticsPage';
import Transactions from './pages/Transactions';
import AddTransaction from './pages/AddTransaction';
import EditTransaction from './pages/EditTransaction';
import SignIn from './pages/SignIn';
import Login from './pages/Login';
import VerifyOtp from './pages/VerifyOtp';
import ForgotPassword from './pages/ForgotPassword';
import LoadingSpinner from './components/LoadingSpinner';
import './styles/App.css';

function AppContent() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Check if current path is an auth page
  const isAuthPage = ['/login', '/signin', '/verify-otp', '/forgot-password'].includes(location.pathname);

  // Show loading spinner while auth state is being restored
  if (loading) {
    return (
      <div className="app">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="app">
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? '' : 'main-content'}>
        <Routes>
          {/* Auth Routes */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/calendar" element={<ProtectedRoute element={<CalendarPage />} />} />
          <Route path="/analytics" element={<ProtectedRoute element={<AnalyticsPage />} />} />
          <Route path="/transactions" element={<ProtectedRoute element={<Transactions />} />} />
          <Route path="/add-transaction" element={<ProtectedRoute element={<AddTransaction />} />} />
          <Route path="/edit-transaction/:id" element={<ProtectedRoute element={<EditTransaction />} />} />

          {/* Catch all - redirect to appropriate page */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
