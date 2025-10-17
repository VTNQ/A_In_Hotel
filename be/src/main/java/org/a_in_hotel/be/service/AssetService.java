package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.springframework.data.domain.Page;

public interface AssetService {
    AssetResponse create(AssetCreateRequest req, String actorEmail);
    AssetResponse update(Long id, AssetUpdateRequest req, String actorEmail);
    AssetResponse changeStatus(Long id, AssetStatusUpdateRequest req, String actorEmail);
    AssetResponse toggleDeactivated(Long id, String actorEmail);
    AssetResponse getById(Long id);
    Page<AssetResponse> findAll(AssetFilterRequest filter);
}
