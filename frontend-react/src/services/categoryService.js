const DEFAULT_CATEGORIES = [
  'Food',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Healthcare',
  'Shopping',
  'Salary',
  'Bonus',
  'Investment',
  'Other'
];

const categoryService = {
  getCategories: () => {
    const stored = localStorage.getItem('custom_categories');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        localStorage.removeItem('custom_categories');
      }
    }
    return [...DEFAULT_CATEGORIES];
  },

  addCategory: (categoryName) => {
    const categories = categoryService.getCategories();
    const normalized = categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
    
    if (!categories.includes(normalized)) {
      categories.push(normalized);
      localStorage.setItem('custom_categories', JSON.stringify(categories));
    }
    return categories;
  },

  resetCategories: () => {
    localStorage.removeItem('custom_categories');
    return [...DEFAULT_CATEGORIES];
  }
};

export default categoryService;
