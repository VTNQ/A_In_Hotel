package org.a_in_hotel.be.exception;

import lombok.Data;
import lombok.Getter;

@Getter
public enum ErrorCode {
    // ==== AUTHENTICATION & AUTHORIZATION ====
    UNAUTHORIZED(401, "Unauthorized: Token is missing or invalid."),
    FORBIDDEN(403, "Forbidden: You don't have permission to access this resource."),

    // ==== CLIENT ERRORS ====
    BAD_REQUEST(400, "Bad request. Please check your input."),
    NOT_FOUND(404, "Resource not found."),
    CONFLICT(409, "Conflict: Resource already exists."),

    // ==== SERVER ERRORS ====
    INTERNAL_SERVER_ERROR(500, "Internal server error."),
    SERVICE_UNAVAILABLE(503, "Service temporarily unavailable."),

    // ==== BUSINESS LOGIC ERRORS ====
    INVALID_TOKEN(1001, "Invalid or expired token."),
    USER_NOT_FOUND(1002, "User not found."),
    ACCESS_DENIED(1003, "Access denied."),
    VALIDATION_FAILED(1004, "Validation failed."),
    DATA_NOT_FOUND(1005, "Requested data not found.");

    private final int code;
    private final String description;

    ErrorCode(int code, String description) {
        this.code = code;
        this.description = description;
    }
}
