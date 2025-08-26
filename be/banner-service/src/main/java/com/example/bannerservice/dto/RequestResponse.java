package com.example.bannerservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

/**
 * Lớp DTO dùng để chuẩn hóa phản hồi API
 * Mặc định,phản hồi có trạng thái response
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RequestResponse<T> {
    /**
     * Trạng thái phản hồi, mặc định là "success".
     */
    private String status;

    /**
     * Thời điểm phản hồi được tạo.
     */
    private String timestamp;

    /**
     * Thông điệp mô tả phản hồi.
     */
    private String message;

    /**
     * Dữ liệu phản hồi có thể chứa đối tượng bất kỳ.
     */
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
}
