package com.example.bannerservice.dto;

import lombok.Data;

import java.time.LocalDateTime;

/**
 * Lớp DTO dùng để chuẩn hóa phản hồi API
 * Mặc định,phản hồi có trạng thái response
 */
@Data
public class RequestResponse<T> {
    /**
     * Trạng thái phản hồi, mặc định là "success".
     */
    private final String status = "success";

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

    /**
     * Constructor nhận cả dữ liệu và thông điệp.
     *
     * @param data    Dữ liệu phản hồi.
     * @param message Thông điệp phản hồi.
     */
    public RequestResponse(T data, String message) {
        this.timestamp = LocalDateTime.now().toString();
        this.message = message;
        this.data = data;
    }

    /**
     * Constructor chỉ nhận dữ liệu, thông điệp mặc định là null.
     *
     * @param data Dữ liệu phản hồi.
     */
    public RequestResponse(T data) {
        this(data, null);
    }

    /**
     * Constructor chỉ nhận thông điệp, dữ liệu mặc định là null.
     *
     * @param message Thông điệp phản hồi.
     */
    public RequestResponse(String message) {
        this.timestamp = LocalDateTime.now().toString();
        this.message = message;
        this.data = null;
    }
}
