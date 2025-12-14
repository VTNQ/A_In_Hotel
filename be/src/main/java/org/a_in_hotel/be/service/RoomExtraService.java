package org.a_in_hotel.be.service;

import jakarta.servlet.http.HttpServletRequest;
import org.a_in_hotel.be.dto.request.ExtraServiceRequest;
import org.a_in_hotel.be.dto.response.ExtraServiceResponse;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

public interface RoomExtraService {
    void save(ExtraServiceRequest request, MultipartFile file);

    Page<ExtraServiceResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);

    void update(ExtraServiceRequest request, Long id,MultipartFile file);

    void updateStatus(Long id, boolean status);

    ExtraServiceResponse findById(Long id);
}
