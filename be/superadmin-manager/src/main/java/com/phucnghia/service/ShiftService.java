package com.phucnghia.service;

import com.phucnghia.dto.request.ShiftRequest;
import com.phucnghia.dto.response.ShiftResponse;

import java.util.List;

public interface ShiftService {
    ShiftResponse create(ShiftRequest request);
    ShiftResponse update(Long id, ShiftRequest request);
    void delete(Long id);
    ShiftResponse findById(Long id);
    List<ShiftResponse> findAll();
}
