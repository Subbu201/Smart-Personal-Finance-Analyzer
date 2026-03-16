package com.finance.analyzer.dto;

public class AuthResponse {
    private Boolean success;
    private String message;
    private UserResponse user;
    private String token;

    public AuthResponse() {
    }

    public AuthResponse(Boolean success, String message, UserResponse user, String token) {
        this.success = success;
        this.message = message;
        this.user = user;
        this.token = token;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}

