package com.example.brandservice.service;

import com.example.brandservice.Enum.HotelStatus;
import com.example.brandservice.dto.request.HotelRequest;

public interface HotelService {
    void save(HotelRequest branch, String token);
    void update(HotelRequest branch, Long id, String token);
    void updateStatus(HotelStatus branchStatus, Long id);

}
