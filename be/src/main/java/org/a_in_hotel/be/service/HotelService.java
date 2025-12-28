package org.a_in_hotel.be.service;


import org.a_in_hotel.be.Enum.HotelStatus;
import org.a_in_hotel.be.dto.request.HotelRequest;
import org.a_in_hotel.be.dto.request.HotelUpdate;
import org.a_in_hotel.be.dto.response.FacilityResponse;
import org.a_in_hotel.be.dto.response.HotelResponse;
import org.a_in_hotel.be.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface HotelService {
    void save(HotelRequest hotel, MultipartFile file);

    void update(HotelUpdate branch, Long id,MultipartFile file);

    void updateStatus(Integer branchStatus, Long id);

    Page<HotelResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);

    Hotel getHotelByAccountId(Long accountId);

    HotelResponse getHotelById(Long id);


}
