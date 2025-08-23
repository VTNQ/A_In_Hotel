package com.example.userservice.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Getter;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

/**
 * Lớp DTO dùng để chuẩn hóa phản hồi API
 * Mặc định,phản hồi có trạng thái response
 */
@Getter
@JsonInclude(JsonInclude.Include.NON_NULL)
public class RequestResponse <T>{
    private final String status = "success";
    private final String timestamp = OffsetDateTime.now().toString();
    private final String message;
    private final T data;

    public RequestResponse(T data, String message) {
        this.data = data;
        this.message = message;
    }

    public RequestResponse(T data) {
        this(data, null);
    }

    public RequestResponse(String message) {
        this(null, message);
    }

    // Factory helpers (tuỳ thích)
    public static <T> RequestResponse<T> of(T data, String message) { return new RequestResponse<>(data, message); }
    public static <T> RequestResponse<T> of(T data) { return new RequestResponse<>(data); }
    public static RequestResponse<Void> msg(String message) { return new RequestResponse<>(message); }
}
