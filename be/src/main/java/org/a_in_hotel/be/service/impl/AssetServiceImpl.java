package org.a_in_hotel.be.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.AssetStatus;
import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.mapper.AssetMapper;
import org.a_in_hotel.be.repository.AssetRepository;
import org.a_in_hotel.be.repository.CategoryRepository;
import org.a_in_hotel.be.repository.RoomRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;


import java.util.Locale;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements org.a_in_hotel.be.service.AssetService {

    private final AssetRepository assetRepository;
    private final CategoryRepository categoryRepository;
    private final RoomRepository roomRepository;
    private final AssetMapper assetMapper;

    private String generateUniqueAssetCode() {
        Random rnd = new Random();
        String code;
        int guard = 0;
        do {
            code = "AS" + String.format(Locale.ROOT, "%04d", rnd.nextInt(10000));
            guard++;
            if (guard > 100) throw new IllegalStateException("Cannot generate unique asset code.");
        } while (assetRepository.existsByAssetCode(code));
        return code;
    }

    private Sort parseSort(String sort) {
        if (!StringUtils.hasText(sort)) return Sort.by(Sort.Direction.DESC, "id");
        String[] parts = sort.split(",");
        String prop = parts[0].trim();
        Sort.Direction dir = (parts.length > 1 && "asc".equalsIgnoreCase(parts[1]))
                ? Sort.Direction.ASC : Sort.Direction.DESC;
        return Sort.by(dir, prop);
    }

    @Override
    @Transactional
    public AssetResponse create(AssetCreateRequest req, String actorEmail) {
        Category cat = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        Room room = null;
        if (req.getRoomId() != null) {
            room = roomRepository.findById(req.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        }

        Asset asset = assetMapper.toEntity(req);
        asset.setCategory(cat);
        asset.setRoom(room);

        if (!StringUtils.hasText(req.getAssetCode())) {
            asset.setAssetCode(generateUniqueAssetCode());
        } else if (assetRepository.existsByAssetCode(req.getAssetCode())) {
            throw new IllegalArgumentException("Asset code already exists");
        }

        asset.setCreatedBy(actorEmail);
        asset.setUpdatedBy(actorEmail);

        asset = assetRepository.save(asset);

        // Không ghi history – chỉ log
        log.info("[ASSET][CREATE] id={}, code={}, by={}", asset.getId(), asset.getAssetCode(), actorEmail);

        return assetMapper.toResponse(asset);
    }

    @Override
    @Transactional
    public AssetResponse update(Long id, AssetUpdateRequest req, String actorEmail) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));

        categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        if (req.getRoomId() != null) {
            roomRepository.findById(req.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        }

        assetMapper.updateEntity(asset, req);
        asset.setUpdatedBy(actorEmail);
        Asset saved = assetRepository.save(asset);

        log.info("[ASSET][UPDATE] id={}, code={}, by={}", saved.getId(), saved.getAssetCode(), actorEmail);

        return assetMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AssetResponse changeStatus(Long id, AssetStatusUpdateRequest req, String actorEmail) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));

        AssetStatus old = asset.getStatus();
        asset.setStatus(req.getStatus());
        asset.setUpdatedBy(actorEmail);
        Asset saved = assetRepository.save(asset);

        log.info("[ASSET][STATUS] id={}, code={}, {} -> {}, note={}, by={}",
                saved.getId(), saved.getAssetCode(), old, saved.getStatus(), req.getNote(), actorEmail);

        return assetMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AssetResponse toggleDeactivated(Long id, String actorEmail) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));

        AssetStatus current = asset.getStatus();
        if (current != AssetStatus.DEACTIVATED) {
            asset.setPreviousStatus(current);          // giữ previousStatus nếu bạn đã thêm field này
            asset.setStatus(AssetStatus.DEACTIVATED);
        } else {
            AssetStatus restore = Optional.ofNullable(asset.getPreviousStatus()).orElse(AssetStatus.GOOD);
            asset.setStatus(restore);
            asset.setPreviousStatus(null);
        }
        asset.setUpdatedBy(actorEmail);
        Asset saved = assetRepository.save(asset);

        log.info("[ASSET][TOGGLE] id={}, code={}, {} -> {}, by={}",
                saved.getId(), saved.getAssetCode(), current, saved.getStatus(), actorEmail);

        return assetMapper.toResponse(saved);
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
    public Page<AssetResponse> findAll(AssetFilterRequest filter) {
        int page = Math.max(1, filter.getPage());
        int size = Math.max(1, Optional.ofNullable(filter.getSize()).orElse(20));
        Pageable pageable = PageRequest.of(page - 1, size, parseSort(filter.getSort()));

        // 1) RSQL filter (có thể null)
        Specification<Asset> rsqlSpec = RSQLJPASupport.toSpecification(filter.getFilter());

        // 2) Search chung (assetCode/assetName/room.roomNumber/category.name)
        Specification<Asset> searchSpec = (root, query, cb) -> {
            if (!StringUtils.hasText(filter.getKeyword())) return null;
            String kw = "%" + filter.getKeyword().trim().toLowerCase() + "%";
            var room = root.join("room", JoinType.LEFT);
            var cat  = root.join("category", JoinType.LEFT);
            query.distinct(true);
            return cb.or(
                    cb.like(cb.lower(root.get("assetCode")), kw),
                    cb.like(cb.lower(root.get("assetName")), kw),
                    cb.like(cb.lower(room.get("roomNumber")), kw),
                    cb.like(cb.lower(cat.get("name")), kw)
            );
        };

        Specification<Asset> spec = Specification.where(rsqlSpec).and(searchSpec);

        return assetRepository.findAll(spec, pageable).map(assetMapper::toResponse);
    }

}
