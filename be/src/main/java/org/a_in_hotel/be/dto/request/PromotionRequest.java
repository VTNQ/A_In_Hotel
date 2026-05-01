package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PromotionRequest {
    @NotBlank(message = "Promotion name is required / Tên chương trình khuyến mãi không được để trống")
    private String name;
    @Size(max = 1000, message = "Description must not exceed 1000 characters / Mô tả không được vượt quá 1000 ký tự")
    private String description;
    @NotNull(message = "Promotion type is required / Loại khuyến mãi không được để trống")
    private Integer type;
    @NotNull(message = "Promotion value is required / Giá trị khuyến mãi không được để trống")
    @DecimalMin(value = "0.0", inclusive = false,
            message = "Promotion value must be greater than 0 / Giá trị khuyến mãi phải lớn hơn 0")
    private BigDecimal value;
    @Min(value = 0, message = "Priority must be greater than or equal to 0 / Độ ưu tiên phải lớn hơn hoặc bằng 0")
    private Integer priority;

    @NotNull(message = "Start date is required / Ngày bắt đầu không được để trống")
    private LocalDate startDate;
    @NotNull(message = "End date is required / Ngày kết thúc không được để trống")
    private LocalDate endDate;
    @NotNull(message = "Booking type is required / Loại đặt phòng không được để trống")
    private Integer bookingType;
    @Min(value = 0, message = "Minimum nights must be greater than or equal to 0 / Số đêm tối thiểu phải lớn hơn hoặc bằng 0")
    private Integer minNights;

    private Integer customerType;

    private List<PromotionRoomTypeRequest> promotionRoomTypeRequests;
}
