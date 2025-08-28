package com.example.commonutils.exception;

import org.springframework.http.HttpStatus;

public class BaseException extends RuntimeException {
    private final HttpStatus status;
    private final ErrorCode errorCode;
    public BaseException(HttpStatus status, ErrorCode errorCode,String message) {
        super(message);
        this.status = status;
        this.errorCode = errorCode;
    }

    public  HttpStatus getStatus() {
        return status;
    }
    public ErrorCode getErrorCode() {
        return errorCode;
    }
}
