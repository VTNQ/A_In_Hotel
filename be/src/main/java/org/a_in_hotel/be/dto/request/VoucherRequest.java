package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class VoucherRequest {
    @NotBlank(message = "Voucher code is required / Mã voucher không được để trống")
    @Size(max = 50, message = "Voucher code must not exceed 50 characters / Mã voucher không vượt quá 50 ký tự")
    private String voucherCode;
    @NotBlank(message = "Voucher name is required / Tên voucher không được để trống")
    @Size(max = 255, message = "Voucher name must not exceed 255 characters / Tên voucher không vượt quá 255 ký tự")
    private String voucherName;
    @NotNull(message = "Voucher type is required / Loại voucher không được để trống")
    private Integer type;
    @Size(max = 1000, message = "Description must not exceed 1000 characters / Mô tả không được vượt quá 1000 ký tự")
    private String description;
    @NotNull(message = "Voucher value is required / Giá trị voucher không được để trống")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Voucher value must be greater than 0 / Giá trị voucher phải lớn hơn 0")
    private BigDecimal value;
    @DecimalMin(value = "0.0", message = "Max discount must be greater than or equal to 0 / Giảm giá tối đa phải ≥ 0")
    private BigDecimal maxDiscountValue;
    @NotNull(message = "Booking type is required / Loại đặt phòng không được để trống")
    private Integer bookingType;
    @Min(value = 0, message = "Minimum stay must be greater than or equal to 0 / Số đêm tối thiểu phải ≥ 0")
    private Integer minimumStay;

    private Integer customerType;
    @NotNull(message = "Usage type is required / Loại sử dụng không được để trống")
    private Integer usageType;
    @Min(value = 1, message = "Usage limit must be greater than 0 / Số lần sử dụng phải lớn hơn 0")
    private Integer usageLimit;
    @Min(value = 1, message = "Usage per customer must be greater than 0 / Số lần dùng mỗi khách phải lớn hơn 0")
    private Integer usagePerCustomer;
    @NotNull(message = "Start date is required / Ngày bắt đầu không được để trống")
    private LocalDate startDate;
    @NotNull(message = "End date is required / Ngày kết thúc không được để trống")
    private LocalDate endDate;

    private Boolean stackWithPromotion;

    private Boolean stackWithOtherVoucher;
    @Min(value = 0, message = "Priority must be greater than or equal to 0 / Độ ưu tiên phải ≥ 0")
    private Integer priority;

    private List<VoucherRoomTypeRequest> roomTypes;
}
