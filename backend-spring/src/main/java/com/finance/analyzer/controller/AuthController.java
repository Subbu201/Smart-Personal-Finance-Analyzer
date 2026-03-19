package com.finance.analyzer.controller;

import com.finance.analyzer.dto.*;
import com.finance.analyzer.exception.ApiException;
import com.finance.analyzer.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001",
        "http://localhost:3002" }, allowCredentials = "true")

public class AuthController {

    @Autowired
    private UserService userService;

    /**
     * Register a new user
     * POST /auth/register
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody SignUpRequest request) {
        try {
            AuthResponse response = userService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(false, e.getMessage(), null, null));
        }
    }

    /**
     * Verify OTP for email verification
     * POST /auth/verify-otp
     */
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody VerifyOtpRequest request) {
        try {
            AuthResponse response = userService.verifyOtp(request);
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new AuthResponse(false, e.getMessage(), null, null));
        }
    }

    /**
     * Resend OTP for registration
     * POST /auth/resend-otp
     */
    @PostMapping("/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody ForgotPasswordRequest request) {
        try {
            ApiResponse response = userService.resendOtp(request);
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * User login
     * POST /auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            AuthResponse response = userService.login(request);
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new AuthResponse(false, e.getMessage(), null, null));
        }
    }

    /**
     * Forgot password - send OTP to email
     * POST /auth/forgot-password
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            ApiResponse response = userService.forgotPassword(request);
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Reset password with OTP
     * POST /auth/reset-password
     */
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        try {
            ApiResponse response = userService.resetPassword(request);
            return ResponseEntity.ok(response);
        } catch (ApiException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ApiResponse(false, e.getMessage()));
        }
    }

    /**
     * Logout
     * POST /auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(
                new ApiResponse(true, "Logout successful"));
    }
}
