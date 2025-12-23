package org.a_in_hotel.be.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookingRequest {

    private String guestName;

    private String surname;

    private String email;

    private String phoneNumber;

    private Integer guestType;

    private Integer numberOfGuests;

    private BigDecimal paidAmount;

    private String paymentMethod;

    private Integer paymentType;

    private String notes;

    private LocalDate checkInDate;

    private BigDecimal totalPrice;

    private LocalTime checkInTime;

    private LocalDate checkOutDate;

    private LocalTime checkOutTime;

    private Integer BookingPackage;


    private List<BookingDetailRequest> bookingDetail;


}
