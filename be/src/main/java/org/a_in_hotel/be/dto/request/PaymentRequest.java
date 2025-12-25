package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PaymentRequest {
    private BigDecimal paidAmount;

    private String paymentMethod;

    private Integer paymentType;

    private String notes;
}
