import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend } from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useAuth } from '../context/AuthContext';
import transactionService from '../services/transactionService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import '../styles/Dashboard.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    fetchDashboardData();
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      if (!tx.date) return false;
      const txDate = new Date(tx.date);
      if (fromDate) {
        const from = new Date(fromDate);
        if (txDate < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        if (txDate > to) return false;
      }
      return true;
    });
  }, [transactions, fromDate, toDate]);

  // Calculate filtered monthly data
  const filteredMonthlyData = useMemo(() => {
    const monthMap = {};
    
    filteredTransactions.forEach(tx => {
      if (!tx.date) return;
      const date = new Date(tx.date);
      const monthKey = date.toLocaleString('en-US', { year: 'numeric', month: 'short' });
      
      if (!monthMap[monthKey]) {
        monthMap[monthKey] = { income: 0, expense: 0 };
      }
      
      if (tx.type === 'income') {
        monthMap[monthKey].income += tx.amount || 0;
      } else if (tx.type === 'expense') {
        monthMap[monthKey].expense += tx.amount || 0;
      }
    });
    
    return Object.entries(monthMap)
      .map(([month, data]) => ({
        month,
        income: data.income,
        expense: data.expense,
        balance: data.income - data.expense
      }))
      .sort((a, b) => new Date(a.month) - new Date(b.month));
  }, [filteredTransactions]);

  const fetchTransactions = async () => {
    try {
      const data = await transactionService.getAllTransactions();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };



  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch summary
      const summaryData = await transactionService.getSummary();
      setSummary(summaryData);

      // Fetch chart data
      const chartData = await transactionService.getCharts();
      
      // Process category data
      const categories = processCategories(chartData.categoryBreakdown || {});
      setCategoryData(categories);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const processMonthlyData = (data) => {
    if (!data.labels) return [];
    return data.labels.map((label, idx) => {
      const income = data.income?.[idx] ?? 0;
      const expense = data.expense?.[idx] ?? 0;
      return {
        month: label,
        income: income,
        expense: expense,
        balance: income - expense
      };
    });
  };

  const processCategories = (data) => {
    if (!data.labels) return [];
    return {
      labels: data.labels || [],
      data: data.data || []
    };
  };

  const COLORS = ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#06b6d4', '#f97316'];

  // Chart configurations
  const monthlyLineChart = {
    labels: filteredMonthlyData.map(m => m.month),
    datasets: [
      {
        label: 'Income',
        data: filteredMonthlyData.map(m => m.income),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Expense',
        data: filteredMonthlyData.map(m => m.expense),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Balance',
        data: filteredMonthlyData.map(m => m.balance),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const barChart = {
    labels: filteredMonthlyData.map(m => m.month),
    datasets: [
      {
        label: 'Income',
        data: filteredMonthlyData.map(m => m.income),
        backgroundColor: '#10b981',
        borderRadius: 8
      },
      {
        label: 'Expense',
        data: filteredMonthlyData.map(m => m.expense),
        backgroundColor: '#ef4444',
        borderRadius: 8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: '#e5e7eb', font: { size: 12 } }
      }
    },
    scales: {
      x: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } },
      y: { ticks: { color: '#9ca3af' }, grid: { color: '#374151' } }
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="dashboard modern-dashboard">
      <div className="dashboard-header">
        <div className="header-title">
          <h1>Finance Manager</h1>
          <p>Your personal money hub - Track, analyze & optimize</p>
        </div>
        <button className="btn-add-transaction" onClick={() => navigate('/add-transaction')}>
          + Add Transaction
        </button>
      </div>

      {error && <ErrorMessage message={error} />}

      {/* Date Range Filters */}
      <div className="filter-section">
        <div className="filter-group">
          <label htmlFor="fromDate">From Date:</label>
          <input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="filter-input"
          />
        </div>
        <div className="filter-group">
          <label htmlFor="toDate">To Date:</label>
          <input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="filter-input"
          />
        </div>
        <button 
          className="filter-btn-reset"
          onClick={() => { setFromDate(''); setToDate(''); }}
        >
          Clear Filters
        </button>
      </div>

      {/* Summary Cards */}
      <div className="summary-grid modern">
            <div className="summary-card income-card">
              <div className="card-header">
                <div className="card-icon">📈</div>
                <span className="card-label">Total Income</span>
              </div>
              <p className="card-amount">₹{(summary?.totalIncome || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            <div className="summary-card expense-card">
              <div className="card-header">
                <div className="card-icon">📉</div>
                <span className="card-label">Total Expense</span>
              </div>
              <p className="card-amount">₹{(summary?.totalExpense || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            <div className="summary-card balance-card">
              <div className="card-header">
                <div className="card-icon">💵</div>
                <span className="card-label">Balance</span>
              </div>
              <p className="card-amount">₹{(summary?.balance || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>

            <div className="summary-card transactions-card">
              <div className="card-header">
                <div className="card-icon">📊</div>
                <span className="card-label">Transactions</span>
              </div>
              <p className="card-amount">{summary?.transactionCount || 0}</p>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Monthly Trend */}
            <div className="chart-card full-width">
              <h2>📊 Monthly Trend</h2>
              <div className="chart-container">
                <Line data={monthlyLineChart} options={chartOptions} />
              </div>
            </div>

            {/* Category & Comparison */}
            <div className="chart-row">
              <div className="chart-card">
                <h2>💹 Income vs Expense</h2>
                <div className="chart-container">
                  <Bar data={barChart} options={chartOptions} />
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Summary Boxes */}
          <div className="monthly-summary-section">
            <h2>📅 Monthly Breakdown</h2>
            <div className="months-container">
              {filteredMonthlyData.length > 0 ? (
                filteredMonthlyData.map((month, idx) => (
                  <div
                    key={idx}
                    className="month-card"
                    onClick={() => navigate(`/transactions?month=${month.month}`)}
                  >
                    <h3 className="month-title">{month.month}</h3>
                    <div className="month-grid">
                      <div className="month-item income">
                        <span className="label">💰 Income</span>
                        <p className="value">₹{month.income.toFixed(2)}</p>
                      </div>
                      <div className="month-item expense">
                        <span className="label">💸 Expense</span>
                        <p className="value">₹{month.expense.toFixed(2)}</p>
                      </div>
                      <div className="month-item balance">
                        <span className="label">💵 Balance</span>
                        <p className={`value ${month.balance >= 0 ? 'positive' : 'negative'}`}>
                          ₹{month.balance.toFixed(2)}</p>
                        
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">
                  <p>🔭 No transactions in this period. Try adjusting your filters!</p>
                  <button onClick={() => navigate('/add-transaction')}>Add Transaction</button>
                </div>
              )}
            </div>
          </div>
    </div>
  );
}

export default Dashboard;
