package com.finance.analyzer.service;

import com.finance.analyzer.dto.*;
import com.finance.analyzer.exception.ApiException;
import com.finance.analyzer.model.User;
import com.finance.analyzer.repository.UserRepository;
import com.finance.analyzer.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    private static final int OTP_VALIDITY_MINUTES = 5;

    // Store temporary registrations in memory (email -> TempRegistration)
    private final Map<String, TempRegistration> tempRegistrations = new ConcurrentHashMap<>();
    private static final Logger logger = Logger.getLogger(UserService.class.getName());

    /**
     * Generate 6-digit OTP
     */
    public String generateOtp() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    /**
     * Register a new user - DOES NOT create account yet
     * Account is created only after OTP verification
     */
    public AuthResponse register(SignUpRequest request) throws ApiException {

        // Validation
        if (request.getFullName() == null || request.getFullName().trim().isEmpty() ||
                request.getEmail() == null || request.getEmail().trim().isEmpty() ||
                request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new ApiException("All fields are required");
        }

        // Log email sending attempt for debugging
        logger.info("Registration attempt for email: " + request.getEmail().trim().toLowerCase());

        if (request.getPassword().length() < 6) {
            throw new ApiException("Password must be at least 6 characters");
        }

        String email = request.getEmail().trim().toLowerCase();

        // Check if email already exists in permanent database
        if (userRepository.existsByEmail(email)) {
            throw new ApiException("Email already registered");
        }

        // Check if already in temp registration
        if (tempRegistrations.containsKey(email)) {
            TempRegistration existing = tempRegistrations.get(email);
            // Resend OTP for existing temp registration if not expired
            if (LocalDateTime.now().isBefore(existing.getOtpExpiry())) {
                boolean emailSent = emailService.sendOtpEmail(email, existing.getOtp());
                if (!emailSent) {
                    logger.severe("Failed to resend OTP email to: " + email);
                    throw new ApiException("Failed to send OTP email. Please check your email address or try again later.");
                }
                logger.info("OTP resent successfully for email: " + email);
                return new AuthResponse(
                        true,
                        "OTP resent. Check your email for verification code.",
                        null,
                        null);
            } else {
                // OTP expired, generate new one
                tempRegistrations.remove(email);
            }
        }

        // Generate OTP
        String otp = generateOtp();
        String hashedPassword = passwordEncoder.encode(request.getPassword());
        LocalDateTime otpExpiry = LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES);

        // Store temporary registration (NO user created yet)
        TempRegistration tempReg = new TempRegistration(
                request.getFullName(),
                email,
                hashedPassword,
                otp,
                otpExpiry);
        tempRegistrations.put(email, tempReg);

        // Send OTP email
        boolean emailSent = emailService.sendOtpEmail(email, otp);
        if (!emailSent) {
            tempRegistrations.remove(email);
            logger.severe("Failed to send OTP email to: " + email);
            throw new ApiException("Failed to send OTP email. Please check your email address or try again later.");
        }

        logger.info("OTP sent successfully for registration: " + email);

        return new AuthResponse(
                true,
                "Registration initiated. Check your email for OTP verification code.",
                null,
                null);
    }

    /**
     * Verify OTP for email verification - CREATES the user account
     */
    public AuthResponse verifyOtp(VerifyOtpRequest request) throws ApiException {

        String email = request.getEmail().trim().toLowerCase();

        // Check if temp registration exists
        TempRegistration tempReg = tempRegistrations.get(email);
        if (tempReg == null) {
            throw new ApiException("No registration found. Please register first.");
        }

        // Check OTP expiry
        if (LocalDateTime.now().isAfter(tempReg.getOtpExpiry())) {
            tempRegistrations.remove(email);
            throw new ApiException("OTP expired. Please register again.");
        }

        // Validate OTP
        if (!tempReg.getOtp().equals(request.getOtp())) {
            throw new ApiException("Invalid OTP");
        }

        // NOW create the actual user (account creation happens here)
        User user = new User();
        user.setName(tempReg.getFullName());
        user.setEmail(email);
        user.setPassword(tempReg.getHashedPassword());
        user.setVerified(true);
        user.setOtp(null);
        user.setOtpExpiry(null);

        // Save user to database
        user = userRepository.save(user);

        // Remove from temp registrations
        tempRegistrations.remove(email);

        logger.info("User account created and verified: " + email);

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(user.getId().toString(), user.getEmail());

        UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail());
        return new AuthResponse(
                true,
                "Email verified successfully. Account created!",
                userResponse,
                token);
    }

    /**
     * Resend OTP for registration
     */
    public ApiResponse resendOtp(ForgotPasswordRequest request) throws ApiException {

        String email = request.getEmail().trim().toLowerCase();

        // Check if temp registration exists
        TempRegistration tempReg = tempRegistrations.get(email);
        if (tempReg == null) {
            throw new ApiException("No registration found. Please register first.");
        }

        // Generate new OTP
        String newOtp = generateOtp();
        LocalDateTime newOtpExpiry = LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES);

        // Update temp registration with new OTP
        tempReg.setOtp(newOtp);
        tempReg.setOtpExpiry(newOtpExpiry);

        // Send new OTP email
        boolean emailSent = emailService.sendOtpEmail(email, newOtp);
        if (!emailSent) {
            throw new ApiException("Failed to send OTP email. Please try again.");
        }

        logger.info("OTP resent for email: " + email);

        return new ApiResponse(true, "OTP resent to your email. Please check.");
    }

    /**
     * User login - only verified users can login
     */
    public AuthResponse login(LoginRequest request) throws ApiException {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("Account not created"));

        logger.info("Login attempt for user: " + request.getEmail() + ", verified: " + user.getVerified());

        if (!user.getVerified()) {
            logger.warning("Login failed - User not verified: " + request.getEmail());
            throw new ApiException("Please verify your email before login");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            logger.warning("Login failed - Invalid password for user: " + request.getEmail());
            throw new ApiException("Invalid email or password");
        }

        String token = jwtTokenProvider.generateToken(user.getId().toString(), user.getEmail());

        UserResponse userResponse = new UserResponse(user.getId(), user.getName(), user.getEmail());
        return new AuthResponse(
                true,
                "Login successful",
                userResponse,
                token);
    }

    /**
     * Forgot password - send OTP to email
     */
    public ApiResponse forgotPassword(ForgotPasswordRequest request) throws ApiException {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("User not found"));

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(OTP_VALIDITY_MINUTES));
        userRepository.save(user);

        boolean emailSent = emailService.sendPasswordResetEmail(request.getEmail(), otp);
        if (!emailSent) {
            throw new ApiException("Failed to send password reset email");
        }

        return new ApiResponse(true, "Password reset OTP sent to your email");
    }

    /**
     * Reset password with OTP
     */
    public ApiResponse resetPassword(ResetPasswordRequest request) throws ApiException {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ApiException("User not found"));

        if (user.getOtp() == null || user.getOtpExpiry() == null) {
            throw new ApiException("No reset request found. Please use forgot password.");
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiry())) {
            throw new ApiException("OTP expired. Please request a new one.");
        }

        if (!user.getOtp().equals(request.getOtp())) {
            throw new ApiException("Invalid OTP");
        }

        if (request.getNewPassword() == null || request.getNewPassword().length() < 6) {
            throw new ApiException("Password must be at least 6 characters");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return new ApiResponse(true, "Password reset successful");
    }

    /**
     * Find user by email
     */
    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Find user by id
     */
    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }
}
