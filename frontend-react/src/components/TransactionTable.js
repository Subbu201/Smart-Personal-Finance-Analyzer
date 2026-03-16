import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/TransactionTable.css';
import { formatCurrency, formatDate, getTypeColor } from '../utils/helpers';

function TransactionTable({ transactions, loading, onDelete }) {
  const navigate = useNavigate();

  if (loading) {
    return <div className="table-container loading">Loading transactions...</div>;
  }

  if (!transactions || transactions.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <p className="empty-icon">📭</p>
          <p className="empty-text">No transactions found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="transaction-table">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Date</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id} className="table-row">
              <td className="cell-amount">
                <span
                  style={{
                    color: getTypeColor(transaction.type),
                    fontWeight: '600',
                  }}
                >
                  {transaction.type === 'income' ? '+' : '-'}
                  {formatCurrency(Math.abs(transaction.amount))}
                </span>
              </td>
              <td className="cell-type">
                <span className={`badge badge-${transaction.type?.toLowerCase()}`}>
                  {transaction.type}
                </span>
              </td>
              <td className="cell-category">{transaction.category}</td>
              <td className="cell-date">{formatDate(transaction.date)}</td>
              <td className="cell-description">
                <span title={transaction.description || ''}>
                  {transaction.description ? transaction.description.substring(0, 20) + '...' : '-'}
                </span>
              </td>
              <td className="cell-actions">
                <button
                  className="btn-action btn-edit"
                  onClick={() => navigate(`/edit-transaction/${transaction.id}`)}
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  className="btn-action btn-delete"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete this transaction?')) {
                      onDelete(transaction.id);
                    }
                  }}
                  title="Delete"
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TransactionTable;
