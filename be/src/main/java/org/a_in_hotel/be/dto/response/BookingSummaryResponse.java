package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
public class BookingSummaryResponse {
    private Long totalBookings;
    private Long nightsStayed;
    private Double totalRevenue;
}
