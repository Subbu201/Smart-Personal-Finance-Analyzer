import axiosInstance from './axios';
import mockApi from './mockData';

const transactionService = {
  /**
   * Get all transactions
   */
  getAllTransactions: async () => {
    try {
      const response = await axiosInstance.get('/transactions');
      return response.data.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock data');
      return mockApi.getTransactions();
    }
  },

  /**
   * Get transaction by ID
   */
  getTransactionById: async (id) => {
    try {
      const response = await axiosInstance.get(`/transactions/${id}`);
      return response.data.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock data');
      return mockApi.getTransaction(id);
    }
  },

  /**
   * Add new transaction
   */
  addTransaction: async (data) => {
    try {
      const response = await axiosInstance.post('/transactions', data);
      return response.data.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock data');
      return mockApi.createTransaction(data);
    }
  },

  /**
   * Update transaction
   */
  updateTransaction: async (id, data) => {
    try {
      const response = await axiosInstance.put(`/transactions/${id}`, data);
      return response.data.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock data');
      return mockApi.updateTransaction(id, data);
    }
  },

  /**
   * Delete transaction
   */
  deleteTransaction: async (id) => {
    try {
      const response = await axiosInstance.delete(`/transactions/${id}`);
      return response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock data');
      return mockApi.deleteTransaction(id);
    }
  },

  /**
   * Get transaction summary (Total Income, Total Expense, Balance)
   */
  getSummary: async () => {
    try {
      const response = await axiosInstance.get('/transactions/summary');
      return response.data.data || response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock data');
      return mockApi.getSummary();
    }
  },

  /**
   * Get financial insights (spending patterns, top category, etc)
   */
  getInsights: async () => {
    try {
      const response = await axiosInstance.get('/analytics/insights');
      return response.data.data || response.data;
    } catch (error) {
      console.warn('Backend unavailable, using mock data');
      return mockApi.getInsights();
    }
  },

  /**
   * Get chart data (category breakdown, monthly trends, income vs expense)
   */
  getCharts: async () => {
    try {
      const response = await axiosInstance.get('/analytics/charts');
      const chartData = response.data.data || response.data;
      
      // Transform backend response to match frontend expectations
      return {
        monthlyBreakdown: {
          labels: chartData.monthlyChart?.labels || [],
          income: chartData.monthlyChart?.income || [],
          expense: chartData.monthlyChart?.expense || []
        },
        categoryBreakdown: {
          labels: chartData.categoryChart?.labels || [],
          data: chartData.categoryChart?.data || []
        },
        incomeVsExpense: {
          labels: chartData.typeChart?.labels || ['Income', 'Expense'],
          income: chartData.typeChart?.data?.[0] || 0,
          expense: chartData.typeChart?.data?.[1] || 0
        }
      };
    } catch (error) {
      console.warn('Backend unavailable, using mock data');
      return mockApi.getCharts();
    }
  },
};

export default transactionService;
