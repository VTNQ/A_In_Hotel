package org.a_in_hotel.be.service;


import org.a_in_hotel.be.Enum.HotelStatus;
import org.a_in_hotel.be.dto.request.HotelRequest;
import org.a_in_hotel.be.dto.request.HotelUpdate;
import org.a_in_hotel.be.dto.response.HotelResponse;
import org.springframework.data.domain.Page;

public interface HotelService {
    void save(HotelRequest branch);

    void update(HotelUpdate branch, Long id);

    void updateStatus(HotelStatus branchStatus, Long id);

    Page<HotelResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);

}
