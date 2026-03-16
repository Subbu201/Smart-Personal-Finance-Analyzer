import React from 'react';
import '../styles/EmptyState.css';

function EmptyState({ title, description, icon, action }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon || '📭'}</div>
      <h3 className="empty-title">{title}</h3>
      <p className="empty-description">{description}</p>
      {action && <div className="empty-action">{action}</div>}
    </div>
  );
}

export default EmptyState;
