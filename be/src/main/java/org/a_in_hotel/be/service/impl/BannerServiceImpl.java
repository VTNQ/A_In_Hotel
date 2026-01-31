package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import org.a_in_hotel.be.dto.request.BannerUpdateDTO;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.BannerRequest;
import org.a_in_hotel.be.dto.response.BannerResponse;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.entity.Banner;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.BannerMapper;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.repository.BannerRepository;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.service.BannerService;
import org.a_in_hotel.be.util.GeneralService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
public class BannerServiceImpl implements BannerService {
    @Autowired
    private GeneralService generalService;
    @Autowired
    private ImageRepository bannerImageRepository;
    @Autowired
    private ImageMapper bannerImageMapper;
    @Autowired
    private BannerRepository bannerRepository;
    @Autowired
    private SecurityUtils securityUtils;
    @Autowired
    private BannerMapper bannerMapper;
    private static final List<String> SEARCH_FIELDS = List.of("bannerCode","name");

    @Override
    @Transactional
    public void save(BannerRequest bannerRequest, MultipartFile image) {
        try {
            log.info("start creating banner:{}", bannerRequest);
            Banner banner =bannerMapper.toEntity(bannerRequest,securityUtils.getCurrentUserId());
            banner = bannerRepository.save(banner);
            if (image != null && !image.isEmpty()) {
                try {
                    FileUploadMeta file = generalService.saveFile(image, "banner");
                    Image bannerImage  = bannerImageMapper.toBannerImage(file);
                    bannerImage.setEntityType("banner");
                    bannerImage.setEntityId(banner.getId());
                    bannerImageRepository.save(bannerImage);
                } catch (Exception e) {
                    throw new RuntimeException("Lỗi khi lưu hình ảnh: " + e.getMessage(), e);
                }
            }
            log.info("Banner created successfully by {}",securityUtils.getCurrentUserId().toString());
        } catch (Exception e) {
            log.error("save banner error : {}", bannerRequest, e);
            throw e;
        }
    }

    @Override
    @Transactional
    public void update(Long id, BannerUpdateDTO bannerRequest, MultipartFile image) {
        try {
            log.info("start to update banner : {}", bannerRequest);
            Banner banner = bannerRepository.getReferenceById(id);
            Image oldImage = bannerImageRepository.findFirstByEntityIdAndEntityType(
                    banner.getId(), "banner")
                    .orElse(null);
            bannerMapper.updateEntityFromDto(bannerRequest,
                                             banner,
                                             securityUtils.getCurrentUserId());
            if (image != null && !image.isEmpty()) {
                if(oldImage != null) {
                    try {
                        generalService.deleFile(oldImage.getUrl());
                    }catch (Exception e) {
                        log.warn("⚠️ Không thể xóa ảnh cũ {}: {}", oldImage.getUrl(), e.getMessage());
                    }
                    bannerImageRepository.delete(oldImage);
                }
                FileUploadMeta meta;
                try {
                    meta = generalService.saveFile(image, "banner");
                }catch (IOException e) {
                    throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR,"Lỗi upload file: " + e.getMessage());
                }
                Image newImage = bannerImageMapper.toBannerImage(meta);
                newImage.setEntityType("Asset");
                newImage.setEntityId(banner.getId());
                bannerImageRepository.save(newImage);
            }

            bannerRepository.save(banner);

            log.info("end to update banner : {}", bannerRequest);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("update banner error : {}", bannerRequest);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<BannerResponse> getListBanner(
            Integer page,
            Integer size,
            String sort,
            String filter,
            String searchField,
            String searchValue,
            boolean all) {
        try {
            log.info("start to get list banner ");
            Specification<Banner> sortable = RSQLJPASupport.toSort(sort);
            Specification<Banner> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<Banner> searchable = SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            return bannerRepository.
                    findAll(sortable.and(filterable).and(searchable),pageable)
                    .map(banner -> bannerMapper.toResponse(banner,bannerImageRepository));
        } catch (Exception e) {
            e.printStackTrace();
            log.error(e.getMessage());
            return null;
        }
    }

    @Override
    public BannerResponse findById(Long id) {
        return bannerRepository.findById(id)
                .map(banner -> bannerMapper.toResponse(banner,bannerImageRepository))
                .orElseThrow(() -> new EntityNotFoundException("Banner not found with id: " + id));
    }

    @Override
    public void delete(Long id) {
        try {
            log.info("start to delete banner : {}", id);
            Banner banner = bannerRepository.findById(id)
                    .orElseThrow(() -> new EntityNotFoundException("Banner not found with id: " + id));
            Image bannerImage = banner.getImage();
            if (bannerImage != null) {
                try {
                    generalService.deleFile(bannerImage.getUrl());
                    bannerImageRepository.delete(bannerImage);
                } catch (Exception e) {
                    log.warn("Không thể xóa ảnh trên MinIO hoặc DB cho banner {}: {}", id, e.getMessage());
                }
            }
            bannerRepository.delete(banner);
            log.info("end to delete banner : {}", id);
        } catch (Exception e) {
            log.error("delete banner error : {}", e.getMessage());
        }
    }
}
