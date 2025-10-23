package org.a_in_hotel.be.service;

import jakarta.servlet.http.HttpServletRequest;
import org.a_in_hotel.be.dto.request.ExtraServiceRequest;
import org.a_in_hotel.be.dto.response.ExtraServiceResponse;
import org.springframework.data.domain.Page;

public interface RoomExtraService {
    void save(ExtraServiceRequest request);

    Page<ExtraServiceResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);

    void update(ExtraServiceRequest request, Long id);

    void updateStatus(Long id, boolean status);

    ExtraServiceResponse findById(Long id);
}
