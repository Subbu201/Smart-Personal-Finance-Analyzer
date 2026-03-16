// Calendar Component - Click transaction to edit directly
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Calendar.css';

const Calendar = ({ transactions = [], onEdit, onDelete }) => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const transactionsByDate = useMemo(() => {
    const map = {};
    transactions.forEach(t => {
      if (t.date) {
        if (!map[t.date]) map[t.date] = [];
        map[t.date].push(t);
      }
    });
    return map;
  }, [transactions]);

  const getDayTransactions = (day) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString().split('T')[0];
    return transactionsByDate[dateStr] || [];
  };

  const getDaySummary = (day) => {
    const dayTransactions = getDayTransactions(day);
    const income = dayTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    const expense = dayTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (t.amount || 0), 0);
    return { income, expense, count: dayTransactions.length };
  };

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const handleTransactionClick = (transaction) => {
    if (transaction && transaction.id) {
      navigate(`/edit-transaction/${transaction.id}`);
    }
  };

  const handleDeleteTransaction = async (id, e) => {
    e.stopPropagation();
    if (onDelete && window.confirm('Delete this transaction?')) {
      await onDelete(id);
    }
  };

  const days = [];
  const totalDays = daysInMonth(currentDate);
  const startingDayOfWeek = firstDayOfMonth(currentDate);

  // Empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button className="nav-btn" onClick={prevMonth}>←</button>
        <h2>{currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h2>
        <button className="nav-btn" onClick={nextMonth}>→</button>
      </div>

      <div className="weekdays">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map((day, index) => {
          if (day === null) return <div key={`empty-${index}`} className="empty-day"></div>;
          
          const summary = getDaySummary(day);
          const hasTransactions = summary.count > 0;
          const dayTransactions = getDayTransactions(day);

          return (
            <div
              key={day}
              className={`calendar-day ${hasTransactions ? 'has-transactions' : ''}`}
            >
              <div className="day-number">{day}</div>
              {hasTransactions && (
                <>
                  <div className="day-summary">
                    <div className="tx-count">{summary.count}</div>
                    {summary.income > 0 && <div className="income">+₹{summary.income.toFixed(0)}</div>}
                    {summary.expense > 0 && <div className="expense">-₹{summary.expense.toFixed(0)}</div>}
                  </div>
                  <div className="day-transactions">
                    {dayTransactions.map((tx) => (
                      <div
                        key={tx.id}
                        className={`day-tx-item ${tx.type}`}
                        onClick={() => handleTransactionClick(tx)}
                        title={`Click to edit: ${tx.category}`}
                      >
                        <span className="day-tx-category">{tx.category}</span>
                        <span className="day-tx-amount">{tx.type === 'income' ? '+' : '-'}₹{tx.amount?.toFixed(0)}</span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTransaction(tx.id, e)}
                          className="day-tx-delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
