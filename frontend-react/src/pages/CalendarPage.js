import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import transactionService from '../services/transactionService';
import Calendar from '../components/Calendar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Dashboard.css';

function CalendarPage() {
  const { user } = useAuth();
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

  const handleEdit = async (id, editData) => {
    try {
      setLoading(true);
      
      await transactionService.updateTransaction(id, editData);
      
      await fetchTransactions();
    } catch (err) {
      setError(err.message);
      console.error('Error updating transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      
      await transactionService.deleteTransaction(id);
      
      await fetchTransactions();
    } catch (err) {
      setError(err.message);
      console.error('Error deleting transaction:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard modern-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>📅 Calendar View</h1>
          <p>Track your daily transactions</p>
        </div>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="dashboard-section">
        <Calendar transactions={transactions} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default CalendarPage;
