package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingDetailRequest {
    @NotNull(message = "Room is required")
    private Long roomId;
    @Size(max = 500, message = "Special request must not exceed 500 characters")
    private String specialRequest;

    private Long extraServiceId;
    @NotNull(message = "Price is required")
    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "Price must be greater than 0"
    )
    private BigDecimal price;

}
