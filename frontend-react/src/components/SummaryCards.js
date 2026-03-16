import React from 'react';
import '../styles/SummaryCards.css';
import { formatCurrency } from '../utils/helpers';

function SummaryCards({ summary, loading }) {
  if (loading) {
    return <div className="summary-cards loading">Loading summary...</div>;
  }

  const cards = [
    {
      title: 'Total Income',
      amount: summary?.totalIncome || 0,
      icon: '📈',
      color: 'income',
    },
    {
      title: 'Total Expense',
      amount: summary?.totalExpense || 0,
      icon: '📉',
      color: 'expense',
    },
    {
      title: 'Balance',
      amount: (summary?.totalIncome || 0) - (summary?.totalExpense || 0),
      icon: '💎',
      color: 'balance',
    },
    {
      title: 'Top Category',
      amount: summary?.topCategory || 'N/A',
      icon: '🏆',
      color: 'category',
    },
  ];

  return (
    <div className="summary-cards">
      {cards.map((card, index) => (
        <div key={index} className={`card card-${card.color}`}>
          <div className="card-icon">{card.icon}</div>
          <div className="card-content">
            <p className="card-title">{card.title}</p>
            <p className="card-amount">
              {typeof card.amount === 'number'
                ? formatCurrency(card.amount)
                : card.amount}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SummaryCards;
