package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
@Data
public class ExtraServiceRequest {
    @NotNull(message = "Service Name is required")
    private String serviceName;
    private String description;
    @NotNull(message = "Category is required")
    @Min(value = 1, message = "Category is required")
    private Long categoryId;
    @NotNull(message = "Extra Charge is required")
    private Integer extraCharge;
    private String note;
    private Integer type;
    private Boolean isActive;
    private Long hotelId;
}
