package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReservationStatisticsResponse {
    private String date;
    private Long booked;
    private Long canceled;
}
