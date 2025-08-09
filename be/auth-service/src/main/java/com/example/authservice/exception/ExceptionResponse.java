package com.example.authservice.exception;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ExceptionResponse {
private final String status="error";
private String timestamp;
private String message;
private Integer code;
    public ExceptionResponse(String message, Integer code) {
        this.timestamp = LocalDateTime.now().toString();
        this.message = message;
        this.code = code;
    }
    public ExceptionResponse(String message) {
        this(message, 400);
    }
}
