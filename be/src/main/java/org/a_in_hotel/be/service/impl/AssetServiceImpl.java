package org.a_in_hotel.be.service.impl;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.AssetMapper;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.repository.AssetRepository;
import org.a_in_hotel.be.repository.CategoryRepository;
import org.a_in_hotel.be.repository.HotelRepository;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.service.HotelService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import io.github.perplexhub.rsql.RSQLJPASupport;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AssetServiceImpl implements org.a_in_hotel.be.service.AssetService {

    private final AssetRepository assetRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;
    private final HotelRepository hotelRepository;
    private final GeneralService generalService;
    private final HotelService hotelService;
    private final ImageMapper imageMapper;
    private final AssetMapper assetMapper;
    private final SecurityUtils securityUtils;
    private static final List<String> SEARCH_FIELDS =  List.of("assetName", "assetCode");


    @Override
    @Transactional
    public void save(AssetCreateRequest req, MultipartFile image) {
        try {
            log.info("➡️ Start creating asset: {}", req.getAssetName());
            Asset asset = assetMapper.toEntity(req,securityUtils.getHotelId()!=null ? securityUtils.getHotelId():req.getHotelId());
            asset.setCreatedBy(securityUtils.getCurrentUserId().toString());
            asset.setUpdatedBy(securityUtils.getCurrentUserId().toString());
            asset=assetRepository.save(asset);
            if(image!=null && !image.isEmpty()) {
                try {
                    FileUploadMeta fileUploadMeta = generalService.saveFile(image, "asset");
                    Image assetImage = imageMapper.toBannerImage(fileUploadMeta);
                    assetImage.setEntityType("Asset");
                    assetImage.setEntityId(asset.getId());
                    imageRepository.save(assetImage);
                }catch (Exception e) {
                    throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lưu hình ảnh: " + e.getMessage());
                }
            }
            log.info("✅ Asset created successfully by {}", securityUtils.getCurrentUserEmail().toString());
        } catch (Exception e) {
            log.error("❌ Failed to create asset: {}", e.getMessage(), e);
            throw new RuntimeException("Error creating asset", e);
        }
    }


    @Override
    @Transactional
    public void update(Long id, AssetUpdateRequest req,MultipartFile image) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));
        Image oldImage = imageRepository.findFirstByEntityIdAndEntityType(asset.getId(), "Asset")
                .orElse(null);
        categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new IllegalArgumentException("Category not found"));

        assetMapper.updateEntity(asset, req);
        asset.setUpdatedBy(securityUtils.getCurrentUserId().toString());
        if(image!=null && !image.isEmpty()) {
            if(oldImage!=null){
                try {
                    generalService.deleFile(oldImage.getUrl());
                }catch (Exception e) {
                    log.warn("⚠️ Không thể xóa ảnh cũ {}: {}", oldImage.getUrl(), e.getMessage());
                }
                imageRepository.delete(oldImage);
            }
            FileUploadMeta meta;
            try {
                meta = generalService.saveFile(image, "asset");
            }catch (IOException e) {
                throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR,"Lỗi upload file: " + e.getMessage());
            }
            Image newImage = imageMapper.toBannerImage(meta);
            newImage.setEntityType("Asset");
            newImage.setEntityId(asset.getId());
            imageRepository.save(newImage);

        }
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
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Asset not found"));
        return assetMapper.toResponse(asset,imageRepository,hotelService);
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
            Page<Asset> assets = assetRepository.findAll(
                    sortable
                            .and(filterable)
                            .and(searchable.and(filterable)),
                    pageable);

            return  assets.map(asset -> assetMapper.toResponse(asset,imageRepository,hotelService));
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }


}
