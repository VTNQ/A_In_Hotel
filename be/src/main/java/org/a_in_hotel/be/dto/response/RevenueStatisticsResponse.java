package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
public class RevenueStatisticsResponse {
    private String date;
    private BigDecimal revenue;

}
