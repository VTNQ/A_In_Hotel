package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.FranchiseInquiryRequest;
import org.a_in_hotel.be.dto.response.FranchiseInquiryResponse;
import org.a_in_hotel.be.entity.FranchiseInquiry;
import org.a_in_hotel.be.exception.NotFoundException;
import org.a_in_hotel.be.mapper.FranchiseInquiryMapper;
import org.a_in_hotel.be.repository.FranchiseInquiryRepository;
import org.a_in_hotel.be.service.FranchiseInquiryService;
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
public class FranchiseInquiryServiceImpl implements FranchiseInquiryService {
    private final FranchiseInquiryRepository repository;

    private final FranchiseInquiryMapper mapper;

    private final SecurityUtils securityUtils;

    private static final List<String> SEARCH_FIELDS = List.of("fullName");

    @Override
    public void save(FranchiseInquiryRequest request) {
        FranchiseInquiry inquiry =
                mapper.toEntity(request, securityUtils.getCurrentUserId());
        repository.save(inquiry);
    }

    @Override
    public Page<FranchiseInquiryResponse> getAll(Integer page, Integer size, String sort, String filter,
                                                 String searchField, String searchValue, boolean all) {
        log.info("fetching list of franchise inquiry ");
        Specification<FranchiseInquiry> sortable = RSQLJPASupport.toSort(sort);
        Specification<FranchiseInquiry> filterable = RSQLJPASupport.toSpecification(filter);
        Specification<FranchiseInquiry> searchable = SearchHelper.buildSearchSpec(
                searchField, searchValue, SEARCH_FIELDS
        );
        Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
        return repository
                .findAll(
                        sortable
                                .and(filterable)
                                .and(searchable.and(filterable)),
                        pageable

                ).map(mapper::toResponse);
    }

    @Override
    public FranchiseInquiryResponse getById(Long id) {
        return repository.findById(id)
                .map(inquiry -> mapper.toResponse(inquiry))
                .orElseThrow(()->new EntityNotFoundException("Franchise Inquiry not found with id:"+id));
    }


}
