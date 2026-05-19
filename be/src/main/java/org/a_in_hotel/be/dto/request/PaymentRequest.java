package org.a_in_hotel.be.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    @NotNull(message = "Paid amount is required")
    @DecimalMin(
            value = "0.0",
            inclusive = false,
            message = "Paid amount must be greater than 0"
    )
    private BigDecimal paidAmount;
    @NotBlank(message = "Payment method is required")
    @Size(max = 50, message = "Payment method is too long")
    private String paymentMethod;
    @NotNull(message = "Payment type is required")
    private Integer paymentType;
    @Size(max = 500, message = "Notes must not exceed 500 characters")
    private String notes;
}
