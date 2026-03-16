import React from 'react';
import '../styles/ErrorMessage.css';

function ErrorMessage({ message, onClose }) {
  if (!message) return null;

  return (
    <div className="error-message-container">
      <div className="error-message-content">
        <span className="error-icon">⚠️</span>
        <span className="error-text">{message}</span>
        {onClose && (
          <button className="error-close" onClick={onClose}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
