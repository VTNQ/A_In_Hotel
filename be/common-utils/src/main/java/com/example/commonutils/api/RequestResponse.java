package com.example.commonutils.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.OffsetDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestResponse<T> {
    private String status;
    private String timestamp;
    private String message;
    private T data;

    public static <T> RequestResponse<T> success(T data, String message) {
        return RequestResponse.<T>builder()
                .status("success")
                .timestamp(OffsetDateTime.now().toString())
                .message(message)
                .data(data)
                .build();
    }

    public static <T> RequestResponse<T> success(String message) {
        return success(null, message);
    }

    public static <T> RequestResponse<T> success(T data) {
        return success(data, "success");
    }

    public static <T> RequestResponse<T> error(String message) {
        return RequestResponse.<T>builder()
                .status("error")
                .timestamp(OffsetDateTime.now().toString())
                .message(message)
                .data(null)
                .build();
    }
    public static <T> RequestResponse<T> error(int code, String message) {
        return RequestResponse.<T>builder()
                .status(String.valueOf(code))
                .timestamp(OffsetDateTime.now().toString())
                .message(message)
                .data(null)
                .build();
    }
}
