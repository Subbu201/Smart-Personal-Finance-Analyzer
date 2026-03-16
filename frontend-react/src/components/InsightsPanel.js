import React from 'react';
import '../styles/InsightsPanel.css';

function InsightsPanel({ insights, loading }) {
  if (loading) {
    return <div className="insights-panel loading">Loading insights...</div>;
  }

  if (!insights || Object.keys(insights).length === 0) {
    return (
      <div className="insights-panel">
        <p className="insights-empty">No insights available yet</p>
      </div>
    );
  }

  return (
    <div className="insights-panel">
      <h3 className="insights-title">💡 Financial Insights</h3>
      <div className="insights-content">
        {insights.message && (
          <p className="insight-item">{insights.message}</p>
        )}
        {insights.recommendations && Array.isArray(insights.recommendations) && (
          <div className="recommendations">
            <h4>Recommendations:</h4>
            <ul>
              {insights.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
        {insights.spendingRate && (
          <p className="insight-item">
            💰 Average spending rate: <strong>{insights.spendingRate}</strong>
          </p>
        )}
        {insights.savingsRate && (
          <p className="insight-item">
            💎 Savings rate: <strong>{insights.savingsRate}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default InsightsPanel;
