package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.BookingRequest;
import org.a_in_hotel.be.dto.response.BookingResponse;
import org.springframework.data.domain.Page;

public interface BookingService {

    void create(BookingRequest request);

    Page<BookingResponse> findAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);
}
