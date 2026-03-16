import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TransactionForm from '../components/TransactionForm';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import transactionService from '../services/transactionService';
import '../styles/EditTransaction.css';

function EditTransaction() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTransaction();
  }, [id]);

  const fetchTransaction = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getTransactionById(id);
      setTransaction(data);
    } catch (err) {
      console.error('Error fetching transaction:', err);
      setError('Failed to load transaction');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setError(null);
    try {
      await transactionService.updateTransaction(id, {
        ...formData,
        amount: parseFloat(formData.amount),
      });
      navigate('/transactions');
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError(err.response?.data?.message || 'Failed to update transaction');
      setSubmitting(false);
    }
  };

  return (
    <div className="edit-transaction-page">
      <div className="edit-transaction-content">
        <div className="form-header">
          <h1>Edit Transaction</h1>
          <p className="form-subtitle">Update transaction details</p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        <div className="form-container">
          {loading ? (
            <LoadingSpinner />
          ) : transaction ? (
            <TransactionForm
              initialData={transaction}
              onSubmit={handleSubmit}
              loading={submitting}
            />
          ) : (
            <ErrorMessage message="Transaction not found" />
          )}
        </div>
      </div>
    </div>
  );
}

export default EditTransaction;
