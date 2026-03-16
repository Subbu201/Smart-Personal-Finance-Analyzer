package com.finance.analyzer.dto;

import java.time.LocalDateTime;

public class TempRegistration {
    private String fullName;
    private String email;
    private String hashedPassword;
    private String otp;
    private LocalDateTime otpExpiry;
    private LocalDateTime createdAt;

    public TempRegistration() {
    }

    public TempRegistration(String fullName, String email, String hashedPassword, String otp, LocalDateTime otpExpiry) {
        this.fullName = fullName;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.otp = otp;
        this.otpExpiry = otpExpiry;
        this.createdAt = LocalDateTime.now();
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getHashedPassword() {
        return hashedPassword;
    }

    public void setHashedPassword(String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public LocalDateTime getOtpExpiry() {
        return otpExpiry;
    }

    public void setOtpExpiry(LocalDateTime otpExpiry) {
        this.otpExpiry = otpExpiry;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
