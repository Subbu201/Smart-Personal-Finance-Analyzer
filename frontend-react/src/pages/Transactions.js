import React, { useState, useEffect } from 'react';
import TransactionTable from '../components/TransactionTable';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import LoadingSpinner from '../components/LoadingSpinner';
import transactionService from '../services/transactionService';
import '../styles/Transactions.css';

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const categories = [
    'food',
    'transportation',
    'entertainment',
    'utilities',
    'health',
    'shopping',
    'salary',
    'bonus',
    'investment',
    'other',
  ];

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    filterTransactions();
  }, [searchTerm, filterType, filterCategory, transactions]);

  const fetchTransactions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await transactionService.getAllTransactions();
      const transactionsList = Array.isArray(data) ? data : data.data || [];
      setTransactions(transactionsList);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  const filterTransactions = () => {
    let filtered = transactions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (t) =>
          t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter((t) => t.type?.toLowerCase() === filterType.toLowerCase());
    }

    // Category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter((t) => t.category?.toLowerCase() === filterCategory.toLowerCase());
    }

    setFilteredTransactions(filtered);
  };

  const handleDelete = async (id) => {
    try {
      await transactionService.deleteTransaction(id);
      setTransactions(transactions.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
    }
  };

  return (
    <div className="transactions-page">
      <div className="transactions-content">
        <div className="transactions-header">
          <h1>Transactions</h1>
          <p className="transactions-subtitle">Manage and view all your transactions</p>
        </div>

        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}

        <div className="transactions-filters">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="filter-group">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div className="filter-group">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || filterType !== 'all' || filterCategory !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterCategory('all');
              }}
              className="btn-reset"
            >
              Clear Filters
            </button>
          )}
        </div>

        <div className="transactions-result">
          <p className="result-count">
            {filteredTransactions.length} transaction{filteredTransactions.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : filteredTransactions.length === 0 ? (
          <EmptyState
            icon="📭"
            title="No Transactions"
            description={
              transactions.length === 0
                ? 'Start by adding your first transaction'
                : 'No transactions match your filters'
            }
          />
        ) : (
          <TransactionTable
            transactions={filteredTransactions}
            loading={false}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}

export default Transactions;
