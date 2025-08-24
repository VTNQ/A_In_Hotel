package com.phucnghia.service;

import com.phucnghia.dto.request.AssignmentRequest;
import com.phucnghia.dto.response.AssignmentResponse;

import java.time.LocalDate;
import java.util.List;

public interface AssignmentService {
    AssignmentResponse assign(AssignmentRequest request);
    AssignmentResponse update(Long id, AssignmentRequest request);
    void delete(Long id);
    List<AssignmentResponse> findByStaff(Long staffId, LocalDate from, LocalDate to);
}
