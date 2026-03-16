package com.finance.analyzer.controller;

import com.finance.analyzer.dto.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/health")
@CrossOrigin(origins = { "http://localhost:3000", "http://localhost:3001",
        "http://localhost:3002" }, allowCredentials = "true")
public class HealthController {

    @GetMapping
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(new ApiResponse(
                true,
                "Server is running",
                LocalDateTime.now()));
    }
}

