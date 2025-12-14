package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.SystemContentRequest;
import org.a_in_hotel.be.dto.response.SystemContentResponse;
import org.springframework.web.multipart.MultipartFile;

public interface SystemContentService {

    void update(Long id,SystemContentRequest request, MultipartFile file);

    SystemContentResponse findByContentKey(Integer contentKey);
}
