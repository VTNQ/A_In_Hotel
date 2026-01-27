package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.dto.request.PromotionRequest;
import org.a_in_hotel.be.dto.request.VoucherRequest;
import org.a_in_hotel.be.dto.request.VoucherRoomTypeRequest;
import org.a_in_hotel.be.dto.response.VoucherResponse;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.Voucher;
import org.a_in_hotel.be.entity.VoucherRoomType;
import org.a_in_hotel.be.exception.ErrorHandler;
import org.a_in_hotel.be.exception.NotFoundException;
import org.a_in_hotel.be.mapper.VoucherMapper;
import org.a_in_hotel.be.repository.CategoryRepository;
import org.a_in_hotel.be.repository.VoucherRepository;
import org.a_in_hotel.be.service.StaffService;
import org.a_in_hotel.be.service.VoucherService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class VoucherServiceImpl implements VoucherService{
    private final VoucherMapper mapper;
    private final SecurityUtils securityUtils;
    private final CategoryRepository categoryRepository;
    private final VoucherRepository repository;
    private final StaffService staffService;
    private final static List<String> SEARCH_FIELDS = List.of("voucherCode", "voucherName");
    @Override
    @Transactional
    public void save(VoucherRequest request) {
        Voucher voucher = mapper.toEntity(request,securityUtils.getCurrentUserId());
        List<VoucherRoomType> roomTypes = createVoucherRoomTypeCondition(request.getRoomTypes(),
                voucher);
        voucher.setRoomTypes(roomTypes);
        repository.save(voucher);
    }

    @Override
    public Page<VoucherResponse> getAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all) {
        try {
            log.info("start get voucher");
            Specification<Voucher> sortable = RSQLJPASupport.toSort(sort);
            Specification<Voucher> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<Voucher> searchable = SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            return repository.findAll(
                    sortable
                            .and(filterable)
                            .and(searchable.and(filterable)),
                    pageable
            ).map(voucher -> mapper.toResponse(voucher,staffService));

        }catch (Exception e){
            log.error(e.getMessage(),e);
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public void update(VoucherRequest request, Long id) {
        Voucher voucher = repository.findById(id)
                .orElseThrow(()->new NotFoundException("Promotion not found: "+id));
        mapper.updateEntity(voucher,request,securityUtils.getCurrentUserId());
        voucher.getRoomTypes().clear();
        List<VoucherRoomType> roomTypes = createVoucherRoomTypeCondition(request.getRoomTypes(),
                voucher);
        voucher.getRoomTypes().addAll(roomTypes);
        repository.save(voucher);
    }

    @Override
    public VoucherResponse getPromotionById(Long id) {
        return repository.findById(id)
                .map(promotion -> mapper.toResponse(promotion,staffService))
                .orElseThrow(() -> new EntityNotFoundException("voucher not found with id: " + id));
    }

    @Override
    public void updateStatus(Long id, Boolean status) {
        try {
            log.info("start update voucher status");
            Voucher voucher = repository.getReferenceById(id);
            voucher.setIsActive(status);
            repository.save(voucher);
        }catch (EntityNotFoundException e){
            log.warn("Voucher with id {} not found: {}",id,e.getMessage());
            throw new ErrorHandler(HttpStatus.NOT_FOUND, "Không tìm thấy voucher có ID: " + id);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    private List<VoucherRoomType> createVoucherRoomTypeCondition(List<VoucherRoomTypeRequest> requests,
                                                                 Voucher voucher){
        if(requests == null || requests.isEmpty()){
            return Collections.emptyList();
        }
        List<VoucherRoomType> list = new ArrayList<>();
        for (VoucherRoomTypeRequest request : requests){
            VoucherRoomType voucherRoomType = new VoucherRoomType();
            Category category = categoryRepository.findById(request.getRoomTypeId())
                    .orElseThrow(() -> new NotFoundException("room Type not found: " + request.getRoomTypeId()));
            voucherRoomType.setRoomTypeId(category);
            voucherRoomType.setExcluded(request.getExcluded());
            voucherRoomType.setVoucher(voucher);
            list.add(voucherRoomType);
        }
        return list;
    }
}
