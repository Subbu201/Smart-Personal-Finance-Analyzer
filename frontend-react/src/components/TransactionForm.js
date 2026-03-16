import React, { useState, useEffect } from 'react';
import categoryService from '../services/categoryService';
import '../styles/TransactionForm.css';

function TransactionForm({ initialData, onSubmit, loading }) {
  const CATEGORY_TYPES = {
    income: ['Salary', 'Freelance', 'Investment', 'Bonus', 'Business', 'Interest', 'Refund'],
    expense: ['Food', 'Transport', 'Entertainment', 'Shopping', 'Bills', 'Healthcare', 'Education', 'Utilities', 'Rent', 'Insurance']
  };

  const [formData, setFormData] = useState(
    initialData || {
      amount: '',
      type: 'expense',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
      description: '',
    }
  );

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  useEffect(() => {
    setCategories(categoryService.getCategories());
  }, []);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        date: initialData.date?.split('T')[0] || initialData.date,
      });
    }
  }, [initialData]);

  const getFilteredCategories = () => {
    const typeCategories = CATEGORY_TYPES[formData.type] || [];
    const allCategories = categoryService.getCategories();
    return allCategories.filter(cat => typeCategories.includes(cat));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }

    if (!formData.type) {
      newErrors.type = 'Type is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      const updated = categoryService.addCategory(newCategory);
      setCategories(updated);
      setFormData(prev => ({ ...prev, category: newCategory.charAt(0).toUpperCase() + newCategory.slice(1).toLowerCase() }));
      setNewCategory('');
      setShowNewCategory(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'type') {
      // When type changes, reset category to first category of new type
      const newTypeCategories = CATEGORY_TYPES[value] || [];
      const defaultCategory = newTypeCategories[0] || 'Other';
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        category: defaultCategory
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form className="transaction-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="amount" className="form-label">
            Amount <span className="required">*</span>
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`form-input ${errors.amount ? 'error' : ''}`}
            placeholder="0.00"
            step="0.01"
            min="0"
          />
          {errors.amount && <span className="error-message">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="type" className="form-label">
            Type <span className="required">*</span>
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            className={`form-input ${errors.type ? 'error' : ''}`}
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          {errors.type && <span className="error-message">{errors.type}</span>}
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Category <span className="required">*</span>
          </label>
          <div className="category-input-group">
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`form-input ${errors.category ? 'error' : ''}`}
            >
              {getFilteredCategories().map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <button 
              type="button" 
              className="btn-add-category"
              onClick={() => setShowNewCategory(!showNewCategory)}
              title="Add new category"
            >
              ➕
            </button>
          </div>
          {showNewCategory && (
            <div className="new-category-input">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter new category name"
                maxLength="30"
                onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
              />
              <button type="button" onClick={handleAddCategory} className="btn-confirm">
                ✓
              </button>
              <button type="button" onClick={() => { setShowNewCategory(false); setNewCategory(''); }} className="btn-cancel">
                ✕
              </button>
            </div>
          )}
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date" className="form-label">
            Date <span className="required">*</span>
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`form-input ${errors.date ? 'error' : ''}`}
          />
          {errors.date && <span className="error-message">{errors.date}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="description" className="form-label">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="form-input form-textarea"
          placeholder="Add any notes about this transaction"
          rows="4"
          maxLength="500"
        />
        <span className="char-count">
          {formData.description.length}/500
        </span>
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-submit"
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Transaction'}
      </button>
    </form>
  );
}

export default TransactionForm;
