package com.example.commonutils.exception;

public enum ErrorCode {
    //Lỗi 4x
    BAD_REQUEST(400,"Request không hợp lệ"),
    UNAUTHORIZED(401,"Người dùng chưa xác thực hoặc token không hợp lệ"),
    FORBIDDEN(403,"Người dùng không có quyền truy cập"),
    NOT_FOUND(404,"Url không hợp lệ"),
    CONFLICT(409,"Xung đột dữ liệu"),
    UNPROCESSABLE_ENTITY(422,"Không xử lý được yêu cầu do dữ liệu không hợp lệ"),
    //Lỗi 5X
    INTERNAL_ERROR(500,"Lỗi hệ thống nội bộ"),
    SERVICE_UNAVAILABLE(503,"Dịch vụ hiện không khả dụng, vui lòng thử lại sau");
    private final int code;
    private final String description;
    ErrorCode(int code, String description) {
        this.code = code;
        this.description = description;
    }
    public int getCode() {
        return code;
    }
    public String getDescription() {
        return description;
    }

}
