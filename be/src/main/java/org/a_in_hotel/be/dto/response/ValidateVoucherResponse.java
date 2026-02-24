package org.a_in_hotel.be.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class ValidateVoucherResponse {
    private BigDecimal discountAmount;
    private BigDecimal finalAmount;
}
