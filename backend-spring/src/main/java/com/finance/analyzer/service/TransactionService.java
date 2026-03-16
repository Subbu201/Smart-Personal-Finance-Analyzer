package com.finance.analyzer.service;

import com.finance.analyzer.dto.TransactionRequest;
import com.finance.analyzer.exception.ApiException;
import com.finance.analyzer.model.Transaction;
import com.finance.analyzer.model.User;
import com.finance.analyzer.repository.TransactionRepository;
import com.finance.analyzer.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service

public class TransactionService {

        @Autowired
        private TransactionRepository transactionRepository;

        @Autowired
        private UserRepository userRepository;

        /**
         * Get all transactions for a user
         */
        public List<Transaction> getTransactions(Long userId) throws ApiException {

                return transactionRepository.findByUserIdOrderByDateDesc(userId);
        }

        /**
         * Get a specific transaction by id for a user
         */
        public Transaction getTransactionById(Long transactionId, Long userId) throws ApiException {
                Transaction transaction = transactionRepository.findById(transactionId)
                                .orElseThrow(() -> new ApiException("Transaction not found"));

                if (!transaction.getUser().getId().equals(userId)) {
                        throw new ApiException("Unauthorized access to transaction");
                }

                return transaction;
        }

        /**
         * Add a new transaction
         */
        public Transaction addTransaction(Long userId, TransactionRequest request) throws ApiException {

                User user = userRepository.findById(userId)
                                .orElseThrow(() -> new ApiException("User not found"));

                if (request.getAmount() == null || request.getAmount() <= 0) {
                        throw new ApiException("Amount must be greater than 0");
                }

                if (request.getCategory() == null || request.getCategory().trim().isEmpty()) {
                        throw new ApiException("Category is required");
                }

                if (request.getType() == null
                                || (!request.getType().equals("income") && !request.getType().equals("expense"))) {
                        throw new ApiException("Type must be 'income' or 'expense'");
                }

                if (request.getDate() == null || request.getDate().trim().isEmpty()) {
                        throw new ApiException("Date is required");
                }

                Transaction transaction = new Transaction();
                transaction.setUser(user);
                transaction.setAmount(request.getAmount());
                transaction.setCategory(request.getCategory());
                transaction.setDescription(request.getDescription());
                transaction.setType(request.getType());
                transaction.setDate(request.getDate());

                return transactionRepository.save(transaction);
        }

        /**
         * Update a transaction
         */
        public Transaction updateTransaction(Long transactionId, Long userId, TransactionRequest request)
                        throws ApiException {

                Transaction transaction = getTransactionById(transactionId, userId);

                if (request.getAmount() != null && request.getAmount() > 0) {
                        transaction.setAmount(request.getAmount());
                }

                if (request.getCategory() != null && !request.getCategory().trim().isEmpty()) {
                        transaction.setCategory(request.getCategory());
                }

                if (request.getDescription() != null) {
                        transaction.setDescription(request.getDescription());
                }

                if (request.getType() != null &&
                                (request.getType().equals("income") || request.getType().equals("expense"))) {
                        transaction.setType(request.getType());
                }

                if (request.getDate() != null && !request.getDate().trim().isEmpty()) {
                        transaction.setDate(request.getDate());
                }

                return transactionRepository.save(transaction);
        }

        /**
         * Delete a transaction
         */
        public void deleteTransaction(Long transactionId, Long userId) throws ApiException {

                Transaction transaction = getTransactionById(transactionId, userId);
                transactionRepository.delete(transaction);
        }

        /**
         * Get summary statistics for a user
         */
        public Map<String, Object> getSummary(Long userId) throws ApiException {
                List<Transaction> userTransactions = getTransactions(userId);

                double totalIncome = userTransactions.stream()
                                .filter(t -> "income".equals(t.getType()))
                                .mapToDouble(Transaction::getAmount)
                                .sum();

                double totalExpense = userTransactions.stream()
                                .filter(t -> "expense".equals(t.getType()))
                                .mapToDouble(Transaction::getAmount)
                                .sum();

                double balance = totalIncome - totalExpense;

                return Map.of(
                                "totalIncome", totalIncome,
                                "totalExpense", totalExpense,
                                "balance", balance,
                                "transactionCount", userTransactions.size());
        }

        /**
         * Get chart data for analytics
         */
        public Map<String, Object> getChartData(Long userId) throws ApiException {
                List<Transaction> userTransactions = getTransactions(userId);

                // Monthly breakdown
                Map<String, Map<String, Double>> monthlyData = userTransactions.stream()
                                .collect(Collectors.groupingBy(
                                                t -> {
                                                        // Extract year-month from date string (format: yyyy-MM-dd)
                                                        String dateStr = t.getDate();
                                                        if (dateStr != null && dateStr.length() >= 7) {
                                                                return dateStr.substring(0, 7); // yyyy-MM
                                                        }
                                                        return "unknown";
                                                },
                                                Collectors.groupingBy(
                                                                t -> t.getType(),
                                                                Collectors.summingDouble(Transaction::getAmount))));

                java.util.List<String> monthLabels = monthlyData.keySet().stream().sorted()
                                .collect(Collectors.toList());
                java.util.List<Double> monthlyIncome = monthLabels.stream()
                                .map(m -> monthlyData.get(m).getOrDefault("income", 0.0))
                                .collect(Collectors.toList());
                java.util.List<Double> monthlyExpense = monthLabels.stream()
                                .map(m -> monthlyData.get(m).getOrDefault("expense", 0.0))
                                .collect(Collectors.toList());

                // Category breakdown
                Map<String, Double> categoryData = userTransactions.stream()
                                .filter(t -> "expense".equals(t.getType()))
                                .collect(Collectors.groupingBy(
                                                Transaction::getCategory,
                                                Collectors.summingDouble(Transaction::getAmount)));

                java.util.List<String> categoryLabels = categoryData.keySet().stream().sorted()
                                .collect(Collectors.toList());
                java.util.List<Double> categoryValues = categoryLabels.stream()
                                .map(categoryData::get)
                                .collect(Collectors.toList());

                // Type breakdown (Income vs Expense)
                double totalIncome = userTransactions.stream()
                                .filter(t -> "income".equals(t.getType()))
                                .mapToDouble(Transaction::getAmount)
                                .sum();
                double totalExpense = userTransactions.stream()
                                .filter(t -> "expense".equals(t.getType()))
                                .mapToDouble(Transaction::getAmount)
                                .sum();

                return Map.of(
                                "monthlyChart", Map.of(
                                                "labels", monthLabels,
                                                "income", monthlyIncome,
                                                "expense", monthlyExpense),
                                "categoryChart", Map.of(
                                                "labels", categoryLabels,
                                                "data", categoryValues),
                                "typeChart", Map.of(
                                                "labels", java.util.List.of("Income", "Expense"),
                                                "data", java.util.List.of(totalIncome, totalExpense)));
        }

        /**
         * Get insights for analytics
         */
        public Map<String, Object> getInsights(Long userId) throws ApiException {
                List<Transaction> userTransactions = getTransactions(userId);

                if (userTransactions.isEmpty()) {
                        return Map.of(
                                        "message", "No transactions found",
                                        "recommendations", java.util.List.of());
                }

                double averageExpense = userTransactions.stream()
                                .filter(t -> "expense".equals(t.getType()))
                                .mapToDouble(Transaction::getAmount)
                                .average()
                                .orElse(0.0);

                String topCategory = userTransactions.stream()
                                .filter(t -> "expense".equals(t.getType()))
                                .collect(Collectors.groupingBy(
                                                Transaction::getCategory,
                                                Collectors.summingDouble(Transaction::getAmount)))
                                .entrySet().stream()
                                .max(Map.Entry.comparingByValue())
                                .map(Map.Entry::getKey)
                                .orElse("N/A");

                return Map.of(
                                "averageExpense", averageExpense,
                                "topCategory", topCategory,
                                "transactionCount", userTransactions.size(),
                                "recommendations", java.util.List.of(
                                                "Track your spending regularly",
                                                "Set a budget for your expenses",
                                                "Review your top spending categories"));
        }
}
