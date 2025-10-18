package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.springframework.data.domain.Page;

public interface AssetService {
    void save(AssetCreateRequest req);
    AssetResponse update(Long id, AssetUpdateRequest req, String actorEmail);
    AssetResponse updateStatus(Long id, AssetStatusUpdateRequest req, String actorEmail);
    AssetResponse getById(Long id);
    Page<AssetResponse> findAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);
}
