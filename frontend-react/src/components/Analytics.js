// Analytics/Charts Component - Focused on Categories
import React, { useMemo } from 'react';
import { Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
} from 'chart.js';
import '../styles/analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler
);

const Analytics = ({ transactions = [] }) => {
  const [fromDate, setFromDate] = React.useState('');
  const [toDate, setToDate] = React.useState('');

  const categoryTypes = {
    income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Business'],
    expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Utilities']
  };

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

  // Calculate category-wise breakdown (ONLY EXPENSES)
  const expenseCategoryBreakdown = useMemo(() => {
    const breakdown = {};
    
    filteredTransactions.forEach(tx => {
      if (tx.type === 'expense') {
        const key = tx.category || 'Uncategorized';
        if (!breakdown[key]) {
          breakdown[key] = { amount: 0, count: 0 };
        }
        breakdown[key].amount += tx.amount || 0;
        breakdown[key].count += 1;
      }
    });

    return breakdown;
  }, [filteredTransactions]);

  // Calculate category-wise breakdown (ONLY INCOME)
  const incomeCategoryBreakdown = useMemo(() => {
    const breakdown = {};
    
    filteredTransactions.forEach(tx => {
      if (tx.type === 'income') {
        const key = tx.category || 'Uncategorized';
        if (!breakdown[key]) {
          breakdown[key] = { amount: 0, count: 0 };
        }
        breakdown[key].amount += tx.amount || 0;
        breakdown[key].count += 1;
      }
    });

    return breakdown;
  }, [filteredTransactions]);

  // Doughnut Chart - Expenses by Category with high contrast colors
  const expenseDoughnutData = useMemo(() => {
    const categories = Object.keys(expenseCategoryBreakdown).sort();
    const colors = [
      '#ff0000', '#ff6600', '#ffaa00', '#ff3300', '#cc0000',
      '#ff1a1a', '#ff9900', '#ff5500', '#dd0000', '#bb0000'
    ];

    return {
      labels: categories.map(cat => `${cat}`),
      datasets: [{
        data: categories.map(cat => expenseCategoryBreakdown[cat].amount),
        backgroundColor: colors.slice(0, categories.length),
        borderColor: '#1f2937',
        borderWidth: 2,
      }]
    };
  }, [expenseCategoryBreakdown]);

  // Bar Chart - Income by Category
  const incomeBarData = useMemo(() => {
    const categories = Object.keys(incomeCategoryBreakdown).sort();
    return {
      labels: categories,
      datasets: [{
        label: 'Income',
        data: categories.map(cat => incomeCategoryBreakdown[cat].amount),
        backgroundColor: '#10b981',
        borderColor: '#059669',
        borderWidth: 1,
        borderRadius: 8
      }]
    };
  }, [incomeCategoryBreakdown]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { size: 12, weight: 500 },
          padding: 15,
          color: '#e5e7eb',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          label: function(context) {
            const value = context.parsed.y || context.parsed;
            return `₹${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#9ca3af',
          callback: function(value) {
            return '₹' + value;
          }
        },
        grid: { color: '#374151' }
      },
      x: {
        ticks: { color: '#9ca3af' },
        grid: { color: '#374151' }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          font: { size: 11, weight: 500 },
          padding: 10,
          color: '#e5e7eb',
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.toFixed(2)}`;
          }
        }
      }
    }
  };

  const totalExpense = Object.values(expenseCategoryBreakdown).reduce((sum, cat) => sum + cat.amount, 0);
  const totalIncome = Object.values(incomeCategoryBreakdown).reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="analytics-container">
      <div className="analytics-header">
        <h2 className="analytics-title">📊 Advanced Analytics</h2>
        <p className="analytics-subtitle">Track spending by categories and income sources</p>
      </div>

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

      {/* Summary Stats */}
      <div className="analytics-stats">
        <div className="stat-card expense">
          <div className="stat-label">Total Expenses</div>
          <div className="stat-amount">₹{Object.values(expenseCategoryBreakdown).reduce((sum, cat) => sum + cat.amount, 0).toFixed(2)}</div>
          <div className="stat-categories">{Object.keys(expenseCategoryBreakdown).length} categories</div>
        </div>
        <div className="stat-card income">
          <div className="stat-label">Total Income</div>
          <div className="stat-amount">₹{Object.values(incomeCategoryBreakdown).reduce((sum, cat) => sum + cat.amount, 0).toFixed(2)}</div>
          <div className="stat-categories">{Object.keys(incomeCategoryBreakdown).length} sources</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Doughnut - Expenses by Category */}
        <div className="chart-box">
          <h3>💸 Expenses by Category</h3>
          <div className="chart-wrapper">
            {Object.keys(expenseCategoryBreakdown).length > 0 ? (
              <Doughnut data={expenseDoughnutData} options={doughnutOptions} />
            ) : (
              <div className="no-data">No expense data</div>
            )}
          </div>
        </div>

        {/* Bar - Income by Category */}
        <div className="chart-box">
          <h3>💰 Income by Source</h3>
          <div className="chart-wrapper">
            {Object.keys(incomeCategoryBreakdown).length > 0 ? (
              <Bar data={incomeBarData} options={chartOptions} />
            ) : (
              <div className="no-data">No income data</div>
            )}
          </div>
        </div>
      </div>


    </div>
  );
};

export default Analytics;
