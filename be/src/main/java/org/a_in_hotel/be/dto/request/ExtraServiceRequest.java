package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.a_in_hotel.be.Enum.UnitExtraService;

import java.math.BigDecimal;
@Data
public class ExtraServiceRequest {
    @NotBlank(message = "tên dịch vụ không được để trống")
    private String serviceName;
    private String description;
    private Long categoryId;
    private BigDecimal price;
    private String note;
    private String currency;
    private UnitExtraService unit;
    private Boolean isActive;
}
