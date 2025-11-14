package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.a_in_hotel.be.Enum.UnitExtraService;

import java.math.BigDecimal;
@Data
public class ExtraServiceRequest {
    @NotNull(message = "Service Name is required")
    private String serviceName;
    private String description;
    @NotNull(message = "Category is required")
    @Min(value = 1, message = "Category is required")
    private Long categoryId;
    @NotNull(message = "Price is required")
    private BigDecimal price;
    @NotNull(message = "Extra Charge is required")
    private Integer extraCharge;
    private String note;
    private String currency;
    @NotNull(message = "Unit is required")
    private UnitExtraService unit;
    private Boolean isActive;
}
