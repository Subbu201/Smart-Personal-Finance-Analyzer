package com.finance.analyzer.controller;

import com.finance.analyzer.dto.ApiResponse;
import com.finance.analyzer.dto.TransactionRequest;
import com.finance.analyzer.exception.ApiException;
import com.finance.analyzer.model.Transaction;
import com.finance.analyzer.model.User;
import com.finance.analyzer.security.JwtTokenProvider;
import com.finance.analyzer.service.TransactionService;
import com.finance.analyzer.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001",
        "http://localhost:3002" }, allowCredentials = "true")

public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    /**
     * Get current user ID from JWT token
     */
    private Long getCurrentUserId(HttpServletRequest request) throws ApiException {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            throw new ApiException("Missing or invalid authorization token");
        }

        String token = authorizationHeader.substring(7);
        String userId = jwtTokenProvider.getUserIdFromToken(token);
        try {
            return Long.parseLong(userId);
        } catch (NumberFormatException e) {
            throw new ApiException("Invalid user ID in token");
        }
    }

    /**
     * Get all transactions for current user
     * GET /transactions
     */
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTransactions(HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);

            List<Transaction> transactions = transactionService.getTransactions(userId);
            return ResponseEntity.ok(new ApiResponse(true, "Transactions fetched successfully", transactions));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to fetch transactions"));
        }
    }

    /**
     * Get a specific transaction by ID
     * GET /transactions/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getTransactionById(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);

            Transaction transaction = transactionService.getTransactionById(id, userId);
            return ResponseEntity.ok(new ApiResponse(true, "Transaction fetched successfully", transaction));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Add a new transaction
     * POST /transactions
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> addTransaction(@RequestBody TransactionRequest request, HttpServletRequest httpRequest) {
        try {
            Long userId = getCurrentUserId(httpRequest);

            Transaction transaction = transactionService.addTransaction(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(new ApiResponse(true, "Transaction created successfully", transaction));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to add transaction"));
        }
    }

    /**
     * Update a transaction
     * PUT /transactions/{id}
     */
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateTransaction(@PathVariable Long id,
            @RequestBody TransactionRequest request, HttpServletRequest httpRequest) {
        try {
            Long userId = getCurrentUserId(httpRequest);

            Transaction transaction = transactionService.updateTransaction(id, userId, request);
            return ResponseEntity.ok(new ApiResponse(true, "Transaction updated successfully", transaction));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to update transaction"));
        }
    }

    /**
     * Delete a transaction
     * DELETE /transactions/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteTransaction(@PathVariable Long id, HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);

            transactionService.deleteTransaction(id, userId);
            return ResponseEntity.ok(new ApiResponse(true, "Transaction deleted successfully", null));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Get summary statistics (total income, expense, balance)
     * GET /transactions/summary
     */
    @GetMapping("/summary")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getSummary(HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);

            var summary = transactionService.getSummary(userId);
            return ResponseEntity.ok(new ApiResponse(true, "Summary fetched successfully", summary));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }
}
