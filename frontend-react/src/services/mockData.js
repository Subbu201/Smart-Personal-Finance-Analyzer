// Mock API Service - Returns sample data for frontend development
// Replace this with real backend calls once backend is ready

const mockTransactions = [
  {
    id: 1,
    title: "Salary",
    amount: 5000,
    type: "income",
    category: "salary",
    date: "2026-03-12",
    description: "Monthly salary"
  },
  {
    id: 2,
    title: "Grocery Shopping",
    amount: 150.50,
    type: "expense",
    category: "food",
    date: "2026-03-11",
    description: "Weekly groceries"
  },
  {
    id: 3,
    title: "Electricity Bill",
    amount: 120,
    type: "expense",
    category: "utilities",
    date: "2026-03-10",
    description: "Monthly electricity"
  },
  {
    id: 4,
    title: "Freelance Project",
    amount: 800,
    type: "income",
    category: "freelance",
    date: "2026-03-09",
    description: "Web design project"
  },
  {
    id: 5,
    title: "Restaurant",
    amount: 45.75,
    type: "expense",
    category: "food",
    date: "2026-03-08",
    description: "Dinner with friends"
  },
  {
    id: 6,
    title: "Gas",
    amount: 60,
    type: "expense",
    category: "transportation",
    date: "2026-03-07",
    description: "Car fuel"
  },
  {
    id: 7,
    title: "Movie Tickets",
    amount: 30,
    type: "expense",
    category: "entertainment",
    date: "2026-03-06",
    description: "Cinema"
  },
  {
    id: 8,
    title: "Bonus",
    amount: 1200,
    type: "income",
    category: "bonus",
    date: "2026-03-05",
    description: "Performance bonus"
  }
];

const mockSummary = {
  totalIncome: 7000,
  totalExpense: 405.25,
  balance: 6594.75,
  transactionCount: 8
};

const mockInsights = [
  "💡 Your top expense category is Food (~$195.75)",
  "📈 Your income this month is $7000",
  "✅ You saved 62.2% of your income this month",
  "⚠️ Entertainment expenses increased by 50% this week"
];

// Mock API service functions
export const mockApi = {
  // Get all transactions with optional filters
  getTransactions: async (params = {}) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let filtered = [...mockTransactions];

        if (params.type) {
          filtered = filtered.filter(t => t.type === params.type);
        }
        if (params.category) {
          filtered = filtered.filter(t => t.category === params.category);
        }
        if (params.limit) {
          filtered = filtered.slice(0, params.limit);
        }

        resolve(filtered);
      }, 300); // Simulate network delay
    });
  },

  // Get single transaction by ID
  getTransaction: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const transaction = mockTransactions.find(t => t.id === parseInt(id));
        if (transaction) {
          resolve(transaction);
        } else {
          reject(new Error("Transaction not found"));
        }
      }, 200);
    });
  },

  // Create new transaction
  createTransaction: async (data) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newTransaction = {
          id: Math.max(...mockTransactions.map(t => t.id)) + 1,
          ...data
        };
        mockTransactions.push(newTransaction);
        resolve(newTransaction);
      }, 300);
    });
  },

  // Update transaction
  updateTransaction: async (id, data) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTransactions.findIndex(t => t.id === parseInt(id));
        if (index !== -1) {
          mockTransactions[index] = { ...mockTransactions[index], ...data };
          resolve(mockTransactions[index]);
        } else {
          reject(new Error("Transaction not found"));
        }
      }, 300);
    });
  },

  // Delete transaction
  deleteTransaction: async (id) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const index = mockTransactions.findIndex(t => t.id === parseInt(id));
        if (index !== -1) {
          mockTransactions.splice(index, 1);
          resolve({ success: true });
        } else {
          reject(new Error("Transaction not found"));
        }
      }, 300);
    });
  },

  // Get summary data
  getSummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockSummary);
      }, 200);
    });
  },

  // Get insights
  getInsights: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(mockInsights);
      }, 200);
    });
  },

  // Get category-wise expenses
  getCategoryExpense: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const categoryExpense = [
          { category: "food", amount: 195.75 },
          { category: "utilities", amount: 120 },
          { category: "transportation", amount: 60 },
          { category: "entertainment", amount: 30 }
        ];
        resolve(categoryExpense);
      }, 200);
    });
  },

  // Get monthly summary
  getMonthlySummary: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const monthly = [
          { month: "Jan", income: 5000, expense: 2500 },
          { month: "Feb", income: 5500, expense: 2800 },
          { month: "Mar", income: 7000, expense: 405.25 }
        ];
        resolve(monthly);
      }, 200);
    });
  },

  // Get chart data
  getCharts: async () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const chartData = {
          monthlyBreakdown: {
            labels: ['January', 'February', 'March'],
            income: [5000, 5500, 7000],
            expense: [2500, 2800, 405.25]
          },
          categoryBreakdown: {
            labels: ['Food', 'Utilities', 'Transportation', 'Entertainment'],
            data: [195.75, 120, 60, 30]
          },
          incomeVsExpense: {
            labels: ['Income', 'Expense'],
            income: 7000,
            expense: 405.25
          }
        };
        resolve(chartData);
      }, 200);
    });
  }
};

export default mockApi;
