package com.finance.analyzer.exception;

public class ApiException extends Exception {
    private int statusCode;

    public ApiException(String message) {
        super(message);
        this.statusCode = 400;
    }

    public ApiException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }
}
