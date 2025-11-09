package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.StaffRequest;
import org.a_in_hotel.be.dto.response.StaffResponse;
import org.springframework.data.domain.Page;

public interface StaffService {
    void createStaff(StaffRequest request);

    Page<StaffResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);

    void updateStatus(Long id, Boolean status);
}
