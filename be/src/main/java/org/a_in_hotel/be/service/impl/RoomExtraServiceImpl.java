package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.ExtraServiceRequest;
import org.a_in_hotel.be.dto.response.ExtraServiceResponse;
import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.entity.ExtraService;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.ExtraServiceMapper;
import org.a_in_hotel.be.mapper.ImageMapper;
import org.a_in_hotel.be.repository.ExtraServiceRepository;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.service.RoomExtraService;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomExtraServiceImpl implements RoomExtraService {
    private final ExtraServiceRepository repository;
    private final ExtraServiceMapper mapper;
    private final SecurityUtils securityUtils;
    private final GeneralService generalService;
    private final ImageMapper imageMapper;
    private final ImageRepository imageRepository;
    private static final List<String> SEARCH_FIELDS = List.of("serviceCode", "serviceName");

    @Override
    @Transactional
    public void save(ExtraServiceRequest request, MultipartFile file) {
        try {
            log.info("start create extra service");
            ExtraService extraService = mapper.toEntity(
                    request,
                    securityUtils.getCurrentUserId(),
                    securityUtils.getHotelId()
                                                       );
            repository.save(extraService);
            if (file != null && !file.isEmpty()) {
                try {
                    FileUploadMeta fileUploadMeta = generalService.saveFile(file, "service");
                    Image extraServiceImage = imageMapper.toBannerImage(fileUploadMeta);
                    extraServiceImage.setEntityType("service");
                    extraServiceImage.setEntityId(extraService.getId());
                    imageRepository.save(extraServiceImage);
                } catch (Exception e) {
                    throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lưu hình ảnh: " + e.getMessage());
                }
            }

        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public Page<ExtraServiceResponse> getAll(
            Integer page, Integer size, String sort, String filter, String searchField, String searchValue,
            boolean all
                                            ) {
        try {
            log.info("start get extra service");
            Specification<ExtraService> sortable = RSQLJPASupport.toSort(sort);
            Specification<ExtraService> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<ExtraService> searchable = SearchHelper.buildSearchSpec(
                    searchField,
                    searchValue,
                    SEARCH_FIELDS
                                                                                 );
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            Page<ExtraService> extraServices = repository.findAll(
                    sortable
                            .and(filterable)
                            .and(searchable.and(filterable)), pageable
                                                                 );
            extraServices.forEach(asset ->
                                          imageRepository.findFirstByEntityIdAndEntityType(asset.getId(), "service")
                                                  .ifPresent(asset::setIcon)
                                 );
            return extraServices.map(mapper::toResponse);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(ExtraServiceRequest request, Long id, MultipartFile file) {
        try {
            log.info("start update extra service");
            ExtraService extraService = repository.getReferenceById(id);
            Image oldImage = imageRepository.findFirstByEntityIdAndEntityType(extraService.getId(), "service")
                    .orElse(null);
            mapper.updateEntityFromDto(request, extraService, securityUtils.getCurrentUserId());
            if (file != null && !file.isEmpty()) {
                if (oldImage != null) {
                    try {
                        generalService.deleFile(oldImage.getUrl());
                    } catch (Exception e) {
                        log.warn("⚠️ Không thể xóa ảnh cũ {}: {}", oldImage.getUrl(), e.getMessage());
                    }
                    imageRepository.delete(oldImage);
                }
                FileUploadMeta meta;
                try {
                    meta = generalService.saveFile(file, "service");
                } catch (IOException e) {
                    throw new ErrorHandler(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi upload file: " + e.getMessage());
                }
                Image newImage = imageMapper.toBannerImage(meta);
                newImage.setEntityType("service");
                newImage.setEntityId(extraService.getId());
                imageRepository.save(newImage);

            }
            repository.save(extraService);
        } catch (EntityNotFoundException e) {
            log.warn("⚠️ Room Extra with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ có ID: " + id);
        }
    }

    @Override
    public void updateStatus(Long id, boolean status) {
        try {
            log.info("start update extra service status");
            ExtraService extraService = repository.getReferenceById(id);
            extraService.setIsActive(status);
            extraService.setUpdatedBy(String.valueOf(securityUtils.getCurrentUserId()));
            repository.save(extraService);
        } catch (EntityNotFoundException e) {
            log.warn("⚠️ Room Extra with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vu có ID: " + id);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public ExtraServiceResponse findById(Long id) {
        try {
            log.info("start get extra service");
            ExtraService extraService = repository.getReferenceById(id);
            imageRepository.findFirstByEntityIdAndEntityType(extraService.getId(), "service")
                    .ifPresent(extraService::setIcon);
            return mapper.toResponse(extraService);
        } catch (EntityNotFoundException e) {
            log.warn("⚠️ Room Extra with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vu có ID: " + id);
        }
    }
}
