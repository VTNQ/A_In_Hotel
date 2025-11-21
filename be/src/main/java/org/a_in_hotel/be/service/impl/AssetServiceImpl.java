package org.a_in_hotel.be.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.AssetStatus;
import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.AssetMapper;
import org.a_in_hotel.be.repository.AssetRepository;
import org.a_in_hotel.be.repository.CategoryRepository;
import org.a_in_hotel.be.repository.HotelRepository;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;


import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements org.a_in_hotel.be.service.AssetService {

    private final AssetRepository assetRepository;
    private final CategoryRepository categoryRepository;
    private final HotelRepository hotelRepository;
    private final AssetMapper assetMapper;
    private final SecurityUtils securityUtils;
    private static final List<String> SEARCH_FIELDS =  List.of("assetName", "assetCode");


    @Override
    @Transactional
    public void save(AssetCreateRequest req) {
        try {
            log.info("➡️ Start creating asset: {}", req.getAssetName());
            // ✅ Map DTO → Entity
            Asset asset = assetMapper.toEntity(req,securityUtils.getHotelId());
            asset.setCreatedBy(securityUtils.getCurrentUserId().toString());
            asset.setUpdatedBy(securityUtils.getCurrentUserId().toString());
            // ✅ Lưu DB
            assetRepository.save(asset);
            log.info("✅ Asset created successfully by {}", securityUtils.getCurrentUserEmail().toString());
        } catch (Exception e) {
            log.error("❌ Failed to create asset: {}", e.getMessage(), e);
            throw new RuntimeException("Error creating asset", e);
        }
    }


    @Override
    @Transactional
    public void update(Long id, AssetUpdateRequest req ) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));

        categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        assetMapper.updateEntity(asset, req);
        asset.setUpdatedBy(securityUtils.getCurrentUserId().toString());
        assetRepository.save(asset);
    }

    @Override
    @Transactional
    public void updateStatus(Long id, Integer status) {
        try {
            Asset asset = assetRepository.getReferenceById(id);
            try {
                asset.setStatus(status);
                asset.setUpdatedBy(String.valueOf(securityUtils.getCurrentUserId()));
            } catch (IllegalArgumentException e) {
                throw new ErrorHandler(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ: " + status);
            }

            assetRepository.save(asset);
            log.info("✅ Cập nhật assert  (ID = {}) -> {}", id, asset.getStatus());
        }catch (EntityNotFoundException e){
            log.warn("⚠️ asset with id {} not found: {}", id, e.getMessage());
            e.printStackTrace();
        }catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }


    @Override
    @Transactional(readOnly = true)
    public AssetResponse getById(Long id) {
        return assetRepository.findById(id)
                .map(assetMapper::toResponse)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AssetResponse> findAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start get asset");
            Specification<Asset> sortable = RSQLJPASupport.toSort(sort);
            Specification<Asset> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<Asset> searchable = SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            return assetRepository.findAll(sortable.and(filterable).and(searchable.and(filterable)), pageable).map(assetMapper::toResponse);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }
}
