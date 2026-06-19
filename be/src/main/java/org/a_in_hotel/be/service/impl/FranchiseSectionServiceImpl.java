package org.a_in_hotel.be.service.impl;


import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.FranchiseSectionRequest;
import org.a_in_hotel.be.dto.response.FranchiseResponse;
import org.a_in_hotel.be.dto.response.FranchiseSectionResponse;
import org.a_in_hotel.be.entity.FranchiseSection;
import org.a_in_hotel.be.exception.NotFoundException;
import org.a_in_hotel.be.mapper.FranchiseSectionMapper;
import org.a_in_hotel.be.repository.FranchiseSectionRepository;
import org.a_in_hotel.be.service.FranchiseSectionService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class FranchiseSectionServiceImpl implements FranchiseSectionService {
    private final FranchiseSectionRepository repository;
    private final FranchiseSectionMapper mapper;
    private static final List<String> SEARCH_FIELDS = List.of("code", "title");
    private final SecurityUtils securityUtils;

    @Override
    public void save(FranchiseSectionRequest request) {
        FranchiseSection section = mapper.toEntity(request,securityUtils.getCurrentUserId());
        repository.save(section);
    }

    @Override
    public Page<FranchiseSectionResponse> getAll(Integer page, Integer size,
                                                 String sort, String filter, String searchField, String searchValue, boolean all) {
        log.info("fetching list of franchise");
        Specification<FranchiseSection> sortable = RSQLJPASupport.toSort(sort);
        Specification<FranchiseSection> filterable = RSQLJPASupport.toSpecification(filter);
        Specification<FranchiseSection> searchable = SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
        Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
        return repository.findAll(
                sortable
                        .and(filterable)
                        .and(searchable.and(filterable)),
                pageable
        ).map(mapper::toResponse);

    }

    @Override
    public void update(FranchiseSectionRequest request, Long id) {
        FranchiseSection entity = repository.findById(id)
                .orElseThrow(() -> new NotFoundException("franchise section not found"));
        mapper.updateEntity(request, entity, securityUtils.getCurrentUserId());
        repository.save(entity);
    }

    @Override
    public FranchiseSectionResponse findFranchiseSectionById(Long id) {
        return repository.findById(id)
                .map(franchiseSection -> mapper.toResponse(franchiseSection))
                .orElseThrow(()->new EntityNotFoundException("Franchise not found with id:"+id));
    }

    @Override
    public void updateStatus(Long id, Boolean status) {
        FranchiseSection franchiseSection = repository.getReferenceById(id);
        franchiseSection.setActive(status);
        repository.save(franchiseSection);
    }
}
