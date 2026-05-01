package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.a_in_hotel.be.annotation.ImageFile;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ExtraServiceRequest {
    @NotNull(message = "Service name is required / Tên dịch vụ không được để trống")
    private String serviceName;
    private String description;
    @NotNull(message = "Category is required / Danh mục không được để trống")
    @Min(value = 1, message = "Category must be valid / Danh mục không hợp lệ")
    private Long categoryId;
    @NotNull(message = "Extra charge is required / Phụ phí không được để trống")
    private Integer extraCharge;
    private String note;
    private Integer type;
    private Boolean isActive;
    private Long hotelId;
    private MultipartFile image;
}
