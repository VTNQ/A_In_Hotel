package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.ExtraServiceRequest;
import org.a_in_hotel.be.dto.response.ExtraServiceResponse;
import org.a_in_hotel.be.entity.ExtraService;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.mapper.ExtraServiceMapper;
import org.a_in_hotel.be.repository.ExtraServiceRepository;
import org.a_in_hotel.be.service.RoomExtraService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class RoomExtraServiceImpl implements RoomExtraService {
    private final ExtraServiceRepository repository;
    private final ExtraServiceMapper mapper;
    private final SecurityUtils securityUtils;
    private static final List<String> SEARCH_FIELDS =  List.of("serviceCode", "serviceName");

    @Autowired
    public RoomExtraServiceImpl(
            ExtraServiceRepository repository,
            ExtraServiceMapper mapper,
            SecurityUtils securityUtils) {
        this.repository = repository;
        this.mapper = mapper;
        this.securityUtils = securityUtils;
    }
    @Override
    public void save(ExtraServiceRequest request) {
        try {
            log.info("start create extra service");
            ExtraService extraService =mapper.toEntity(request,securityUtils.getCurrentUserId());
            repository.save(extraService);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public Page<ExtraServiceResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start get extra service");
            Specification<ExtraService>sortable= RSQLJPASupport.toSort(sort);
            Specification<ExtraService>filterable= RSQLJPASupport.toSpecification(filter);
            Specification<ExtraService>searchable= SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page-1,size);
            return repository.findAll(sortable.and(filterable).and(searchable.and(filterable)), pageable).map(mapper::toResponse);
        }catch (Exception e){
            log.error(e.getMessage(),e);
            throw new RuntimeException(e);
        }
    }

    @Override
    public void update(ExtraServiceRequest request,Long id) {
        try {
            log.info("start update extra service");
            ExtraService extraService = repository.getReferenceById(id);
            mapper.updateEntityFromDto(request,extraService,securityUtils.getCurrentUserId());
            repository.save(extraService);
        }catch (EntityNotFoundException e){
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
        }catch (EntityNotFoundException e){
            log.warn("⚠️ Room Extra with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vu có ID: " + id);
        }catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public ExtraServiceResponse findById(Long id) {
        try {
            log.info("start get extra service");
            ExtraService extraService = repository.getReferenceById(id);
            return mapper.toResponse(extraService);
        }catch (EntityNotFoundException e){
            log.warn("⚠️ Room Extra with id {} not found: {}", id, e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vu có ID: " + id);
        }
    }
}
