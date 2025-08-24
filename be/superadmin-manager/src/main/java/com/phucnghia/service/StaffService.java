package com.phucnghia.service;

import com.phucnghia.dto.request.StaffRequest;
import com.phucnghia.dto.response.StaffResponse;

import java.util.List;

public interface StaffService {
    StaffResponse create(StaffRequest request);
    StaffResponse update(Long id, StaffRequest request);
    void delete(Long id);
    StaffResponse findById(Long id);
    List<StaffResponse> findAll();
}
