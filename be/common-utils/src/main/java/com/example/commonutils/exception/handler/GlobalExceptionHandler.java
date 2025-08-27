package com.example.commonutils.exception.handler;

import com.example.commonutils.api.RequestResponse;
import com.example.commonutils.exception.BaseException;
import com.example.commonutils.exception.ErrorCode;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.resource.NoResourceFoundException;
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<RequestResponse<Object>>handleException(BaseException ex){
        return ResponseEntity
                .status(ex.getStatus())
                .body(RequestResponse.error(ex.getErrorCode().getCode(),ex.getMessage()));
    }
    @ExceptionHandler
    public ResponseEntity<RequestResponse<Object>> handleNotFound(NoResourceFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(RequestResponse.error(ErrorCode.NOT_FOUND.getCode(),
                        "Đường dẫn không tồn tại: " + ex.getResourcePath()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<RequestResponse<Object>>handleValidation(MethodArgumentNotValidException ex){
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(RequestResponse.error(ex.getStatusCode().value(),ex.getMessage()));
    }
}
