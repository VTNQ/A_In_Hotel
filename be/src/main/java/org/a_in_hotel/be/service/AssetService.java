package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.springframework.data.domain.Page;

public interface AssetService {
    void save(AssetCreateRequest req);
    void update(Long id, AssetUpdateRequest req);
    void updateStatus(Long id, Integer status);
    AssetResponse getById(Long id);
    Page<AssetResponse> findAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);
}
