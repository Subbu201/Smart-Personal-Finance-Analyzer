import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import transactionService from '../services/transactionService';
import Analytics from '../components/Analytics';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Dashboard.css';

function AnalyticsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard modern-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>📊 Advanced Analytics</h1>
          <p>View detailed spending and income analysis by categories</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="dashboard-section">
        <Analytics transactions={transactions} />
      </div>
    </div>
  );
}

export default AnalyticsPage;
