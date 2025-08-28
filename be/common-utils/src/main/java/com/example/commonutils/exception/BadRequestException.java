package com.example.commonutils.exception;

import org.springframework.http.HttpStatus;

public class BadRequestException extends BaseException {

    public BadRequestException( String message) {
        super(HttpStatus.BAD_REQUEST,ErrorCode.BAD_REQUEST, message);
    }
}
