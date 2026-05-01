package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BookingStatisticsResponse {

    private Long totalNewBookings;
    private Double newBookingGrowth;

    private Long totalCheckIn;
    private Double checkInGrowth;

    private Long totalCheckOut;
    private Double checkOutGrowth;

    private BigDecimal totalRevenue;
    private Double revenueGrowth;
}
