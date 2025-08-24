package com.example.hotelservice.service;

import com.example.hotelservice.Enum.HotelStatus;
import com.example.hotelservice.dto.request.HotelRequest;
import com.example.hotelservice.dto.request.HotelUpdate;
import com.example.hotelservice.dto.response.HotelResponse;
import org.springframework.data.domain.Page;

public interface HotelService {
    void save(HotelRequest branch, String token);
    void update(HotelUpdate branch, Long id, String token);
    void updateStatus(HotelStatus branchStatus, Long id);
    Page<HotelResponse>getAll(int page, int size, String sort, String filter, String search, boolean all);

}
