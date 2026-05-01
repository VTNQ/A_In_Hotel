package org.a_in_hotel.be.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
@Data
@AllArgsConstructor
@NoArgsConstructor
public class BookingListTopResponse {
    private String bookingCode;
    private String guestName;
    private String roomType;
    private LocalDate checkInDate;
    private String roomNumber;

    private LocalTime checkInTime;

    private LocalDate checkOutDate;

    private LocalTime checkOutTime;

    private Integer status;
}
