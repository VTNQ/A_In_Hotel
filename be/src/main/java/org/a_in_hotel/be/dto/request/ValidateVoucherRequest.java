package org.a_in_hotel.be.dto.request;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ValidateVoucherRequest {
    private String voucherCode;
    private BigDecimal totalAmount;
    private Integer nights;
    private List<Long> roomTypeIds;
}
