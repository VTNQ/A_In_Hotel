package org.a_in_hotel.be.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.AssetStatus;
import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.a_in_hotel.be.entity.*;
import org.a_in_hotel.be.mapper.AssetMapper;
import org.a_in_hotel.be.repository.*;
import org.a_in_hotel.be.spec.AssetSpecifications;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Locale;
import java.util.Optional;
import java.util.Random;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements org.a_in_hotel.be.service.AssetService {

    private final AssetRepository assetRepository;
    private final AssetHistoryRepository historyRepository;
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

        historyRepository.save(AssetHistory.builder()
                .asset(asset)
                .action("CREATE")
                .newStatus(asset.getStatus())
                .newRoomId(asset.getRoom() != null ? asset.getRoom().getId() : null)
                .note("Created asset")
                .changedBy(actorEmail)
                .build());

        // TODO: publish event nếu cần đồng bộ Room Management

        return assetMapper.toResponse(asset);
    }

    @Override
    @Transactional
    public AssetResponse update(Long id, AssetUpdateRequest req, String actorEmail) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));

        AssetStatus oldStatus = asset.getStatus();
        Long oldRoomId = asset.getRoom() != null ? asset.getRoom().getId() : null;

        categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));
        if (req.getRoomId() != null) {
            roomRepository.findById(req.getRoomId())
                    .orElseThrow(() -> new IllegalArgumentException("Room not found"));
        }

        assetMapper.updateEntity(asset, req);
        asset.setUpdatedBy(actorEmail);
        Asset saved = assetRepository.save(asset);

        historyRepository.save(AssetHistory.builder()
                .asset(saved)
                .action("UPDATE")
                .oldStatus(oldStatus)
                .newStatus(saved.getStatus())
                .oldRoomId(oldRoomId)
                .newRoomId(saved.getRoom() != null ? saved.getRoom().getId() : null)
                .note(req.getNotes())
                .changedBy(actorEmail)
                .build());

        // TODO: publish event nếu cần đồng bộ Room Management

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

        historyRepository.save(AssetHistory.builder()
                .asset(saved)
                .action("STATUS_CHANGE")
                .oldStatus(old)
                .newStatus(saved.getStatus())
                .note(req.getNote())
                .changedBy(actorEmail)
                .build());

        // TODO: publish event nếu cần

        return assetMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public AssetResponse toggleDeactivated(Long id, String actorEmail) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));

        AssetStatus current = asset.getStatus();
        if (current != AssetStatus.DEACTIVATED) {
            asset.setPreviousStatus(current);
            asset.setStatus(AssetStatus.DEACTIVATED);
        } else {
            AssetStatus restore = Optional.ofNullable(asset.getPreviousStatus())
                    .orElse(AssetStatus.GOOD);
            asset.setStatus(restore);
            asset.setPreviousStatus(null);
        }
        asset.setUpdatedBy(actorEmail);
        Asset saved = assetRepository.save(asset);

        historyRepository.save(AssetHistory.builder()
                .asset(saved)
                .action("TOGGLE_DEACTIVATED")
                .oldStatus(current)
                .newStatus(saved.getStatus())
                .changedBy(actorEmail)
                .build());

        // TODO: publish event nếu cần

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

        var spec = AssetSpecifications.filter(
                filter.getKeyword(),
                filter.getStatus(),
                filter.getCategoryId(),
                filter.getRoomId()
        );

        return assetRepository.findAll(spec, pageable).map(assetMapper::toResponse);
    }
}
