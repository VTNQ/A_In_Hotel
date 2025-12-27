package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingDetailResponse {

    private Long id;

    private Long bookingId;

    private Long roomId;

    private String roomName;

    private String roomNumber;

    private String roomType;

    private String extraServiceName;

    private String specialRequests;

    private Long extraServiceId;

    private Integer quantity;

    private BigDecimal price;

}
