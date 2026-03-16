package com.finance.analyzer.controller;

import com.finance.analyzer.dto.ApiResponse;
import com.finance.analyzer.exception.ApiException;
import com.finance.analyzer.security.JwtTokenProvider;
import com.finance.analyzer.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/analytics")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001",
        "http://localhost:3002" }, allowCredentials = "true")
public class AnalyticsController {

    @Autowired
    private TransactionService transactionService;

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
     * Get chart data for analytics
     * GET /analytics/charts
     */
    @GetMapping("/charts")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getCharts(HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);

            var chartData = transactionService.getChartData(userId);
            return ResponseEntity.ok(new ApiResponse(true, "Chart data fetched successfully", chartData));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to fetch chart data"));
        }
    }

    /**
     * Get insights for analytics
     * GET /analytics/insights
     */
    @GetMapping("/insights")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getInsights(HttpServletRequest request) {
        try {
            Long userId = getCurrentUserId(request);

            var insights = transactionService.getInsights(userId);
            return ResponseEntity.ok(new ApiResponse(true, "Insights fetched successfully", insights));
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ApiResponse(false, e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse(false, "Failed to fetch insights"));
        }
    }
}
