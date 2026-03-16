/**
 * Format currency to INR
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};

/**
 * Format date to readable format
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date for input field (YYYY-MM-DD)
 */
export const formatDateForInput = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get type color (income/expense)
 */
export const getTypeColor = (type) => {
  return type === 'income' ? '#10b981' : '#ef4444';
};

/**
 * Get category color
 */
export const getCategoryColor = (category) => {
  const colors = {
    'Food & Dining': '#FF6B6B',
    'Transportation': '#4ECDC4',
    'Entertainment': '#FFE66D',
    'Shopping': '#FF85A2',
    'Bills & Utilities': '#95E1D3',
    'Healthcare': '#F38181',
    'Education': '#AA96DA',
    'Fitness': '#FCBAD3',
    'Other': '#A8D8EA',
    'Salary': '#90EE90',
    'Bonus': '#87CEEB',
    'Investment': '#FFD700',
  };
  return colors[category] || '#B0BEC5';
};

/**
 * Validate email
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate amount (positive number)
 */
export const validateAmount = (amount) => {
  return amount > 0 && !isNaN(amount);
};

/**
 * Get relative time (e.g., "2 hours ago")
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(date);
};
