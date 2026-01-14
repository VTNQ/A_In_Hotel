package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.VoucherStatus;
import org.a_in_hotel.be.dto.request.VoucherRequest;
import org.a_in_hotel.be.dto.response.VoucherResponse;
import org.a_in_hotel.be.entity.Voucher;
import org.a_in_hotel.be.mapper.VoucherMapper;
import org.a_in_hotel.be.repository.VoucherRepository;
import org.a_in_hotel.be.service.VoucherService;
import org.a_in_hotel.be.util.SearchHelper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoucherServiceImpl implements VoucherService {

    private final VoucherMapper mapper;

    private final VoucherRepository repository;

    private final static List<String> SEARCH_FIELDS = List.of("voucherCode","voucherName");
    @Override
    public void create(VoucherRequest request) {
        Voucher voucher = mapper.toEntity(request);
        repository.save(voucher);
    }

    @Override
    public void update(Long id, VoucherRequest request) {
        Voucher voucher = repository.getReferenceById(id);
        mapper.updateEntity(voucher,request);
        repository.save(voucher);
    }

    @Override
    public Page<VoucherResponse> getAll(Integer page,
                                        Integer size,
                                        String sort,
                                        String filter,
                                        String searchField,
                                        String searchValue,
                                        boolean all) {
        try {
            log.info("fetching list of vouchers");
            Specification<Voucher> sortable = RSQLJPASupport.toSort(sort);
            Specification<Voucher> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<Voucher> searchable = SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page-1,size);
            return repository.findAll(sortable.and(filterable).and(searchable.and(filterable)),pageable)
                    .map(mapper::toResponse);
        }catch (Exception e){
            log.info("Failed to fetch voucher",e);
            throw e;
        }
    }

    @Override
    public VoucherResponse findVoucherById(Long id) {
        return repository.findById(id)
                .map(mapper::toResponse)
                .orElseThrow(()->new IllegalArgumentException("voucher not found"));
    }

    @Override
    public void changeStatus(Long id, Integer status) {
        Voucher voucher = repository.getReferenceById(id);
        voucher.setStatus(VoucherStatus.fromValue(status).getValue());
        repository.save(voucher);
    }
}
