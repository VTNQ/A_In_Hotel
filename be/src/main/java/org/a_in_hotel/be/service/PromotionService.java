package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.PromotionRequest;
import org.a_in_hotel.be.dto.response.PromotionResponse;
import org.springframework.data.domain.Page;

public interface PromotionService {

    void save(PromotionRequest request);

    Page<PromotionResponse> getAll(Integer page, Integer size,
                                   String sort, String filter,
                                   String searchField, String searchValue, boolean all);
}
