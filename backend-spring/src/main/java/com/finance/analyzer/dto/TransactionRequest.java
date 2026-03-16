package com.finance.analyzer.dto;

public class TransactionRequest {
    private String title;
    private String description;
    private Double amount;
    private String category;
    private String type;
    private String date;

    public TransactionRequest() {
    }

    public TransactionRequest(String title, String description, Double amount,
            String category, String type, String date) {
        this.title = title;
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.type = type;
        this.date = date;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }
}

