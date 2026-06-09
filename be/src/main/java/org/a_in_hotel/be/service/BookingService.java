package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.BookingListTopResponse;
import org.a_in_hotel.be.dto.response.BookingResponse;
import org.springframework.data.domain.Page;

public interface BookingService {

    void create(BookingRequest request);



    Page<BookingResponse> findAll(
            Integer page,
            Integer size,
            String sort,
            String filter,
            String searchField,
            String searchValue,
            boolean mine,
            boolean all);

    BookingResponse findById(Long id);

    void confirmCheckIn(Long bookingId);

    void cancelBooking(Long bookingId);

    void confirmCheckOut(Long bookingId, CheckOutRequest request);

    void switchRoom(Long bookingId, SwitchRoomRequest request);

    BookingResponse findByIdAndDetailsActiveTrue(Long id);
    Page<BookingListTopResponse> getBookingTop(
            Integer page,
            Integer size,
            String sort,
            String filter,
            String searchField,
            String searchValue,
            boolean all
    );
    void approveBooking(Long id);

    void rejectBooking(Long id);

}
