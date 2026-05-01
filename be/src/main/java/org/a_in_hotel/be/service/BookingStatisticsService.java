package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.response.*;
import org.springframework.data.domain.Page;

import java.util.List;

public interface BookingStatisticsService {

    BookingStatisticsResponse getBookingStatistics();

    RoomAvailabilityResponse getRoomAvailability();

    List<RevenueStatisticsResponse> getRevenue();

    List<ReservationStatisticsResponse> getReservation();


}
