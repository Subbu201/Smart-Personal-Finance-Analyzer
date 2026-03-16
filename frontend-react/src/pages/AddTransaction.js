import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import ErrorMessage from '../components/ErrorMessage';
import transactionService from '../services/transactionService';
import '../styles/AddTransaction.css';

function AddTransaction() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      await transactionService.addTransaction({
        ...formData,
        amount: parseFloat(formData.amount),
      });
      navigate('/transactions');
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-transaction-page">
      <div className="add-transaction-content">
        <div className="form-header">
          <h1>Add New Transaction</h1>
          <p className="form-subtitle">Record a new income or expense</p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        <div className="form-container">
          <TransactionForm onSubmit={handleSubmit} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default AddTransaction;
