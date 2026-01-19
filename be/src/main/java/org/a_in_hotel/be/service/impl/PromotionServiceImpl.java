package org.a_in_hotel.be.service.impl;

import io.github.perplexhub.rsql.RSQLJPASupport;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.a_in_hotel.be.Enum.BookingPackage;
import org.a_in_hotel.be.Enum.PromotionCustomerType;
import org.a_in_hotel.be.Enum.PromotionDayType;
import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.PromotionResponse;
import org.a_in_hotel.be.dto.response.StaffResponse;
import org.a_in_hotel.be.entity.*;
import org.a_in_hotel.be.exception.NotFoundException;
import org.a_in_hotel.be.mapper.PromotionMapper;
import org.a_in_hotel.be.repository.CategoryRepository;
import org.a_in_hotel.be.repository.PromotionRepository;
import org.a_in_hotel.be.repository.StaffRepository;
import org.a_in_hotel.be.service.PromotionService;
import org.a_in_hotel.be.service.StaffService;
import org.a_in_hotel.be.util.SearchHelper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PromotionServiceImpl implements PromotionService {

    private final PromotionRepository repository;

    private final PromotionMapper mapper;
    private final SecurityUtils securityUtils;
    private final CategoryRepository categoryRepository;
    private final StaffService staffService;
    private final static List<String> SEARCH_FIELDS = List.of("code", "name");

    @Override
    @Transactional
    public void save(PromotionRequest request) {
        Promotion promotion = mapper.toEntity(request,securityUtils.getCurrentUserId());
        PromotionBookingCondition bookingConditions = createPromotionBookingCondition
                (request.getBookingConditionRequests(),
                        promotion);
        PromotionCustomerCondition customerConditions = createPromotionCustomerCondition
                (request.getCustomerConditionRequests(),
                        promotion);
        PromotionDateCondition dateConditions = createPromotionDateCondition(
                request.getPromotionDateConditionRequests(),
                promotion
        );
        List<PromotionRoomType> promotionRoomTypes = createPromotionRoomTypeCondition(
                request.getPromotionRoomTypeRequests(),
                promotion
        );
        promotion.setBookingCondition(bookingConditions);
        promotion.setCustomerCondition(customerConditions);
        promotion.setDateCondition(dateConditions);
        promotion.setRoomTypes(promotionRoomTypes);
        repository.save(promotion);
    }

    @Override
    public Page<PromotionResponse> getAll(Integer page, Integer size,
                                          String sort, String filter,
                                          String searchField,
                                          String searchValue, boolean all) {
        try {
            log.info("start get promotion");
            Specification<Promotion> sortable = RSQLJPASupport.toSort(sort);
            Specification<Promotion> filterable = RSQLJPASupport.toSpecification(filter);
            Specification<Promotion> searchable = SearchHelper.buildSearchSpec(searchField, searchValue, SEARCH_FIELDS);
            Pageable pageable = all ? Pageable.unpaged() : PageRequest.of(page - 1, size);
            return  repository.findAll(
                    sortable
                            .and(filterable)
                            .and(searchable.and(filterable)),
                    pageable
            ).map(promotion -> mapper.toResponse(promotion,staffService));
        }catch (Exception e){
            log.error(e.getMessage(), e);
            throw new RuntimeException(e.getMessage());
        }
    }

    private PromotionBookingCondition createPromotionBookingCondition(PromotionBookingConditionRequest request,
                                                                      Promotion promotion) {
        if (request == null) {
            return null;
        }

        PromotionBookingCondition condition = new PromotionBookingCondition();
        condition.setPromotion(promotion);
        condition.setBookingType(BookingPackage.getBookingPackage(request.getBookingType()).getCode());
        condition.setMaxNights(request.getMaxNights());
        condition.setMinRooms(request.getMinRooms());
        condition.setMinNights(request.getMinNights());


        return condition;
    }

    private PromotionCustomerCondition createPromotionCustomerCondition(PromotionCustomerConditionRequest request, Promotion promotion) {

        if (request == null) {
            return null;
        }

        PromotionCustomerCondition condition = new PromotionCustomerCondition();
        condition.setPromotion(promotion);
        condition.setCustomerType(PromotionCustomerType.fromValue(request.getCustomerType()).getCode());

        return condition;
    }

    private PromotionDateCondition createPromotionDateCondition(PromotionDateConditionRequest request,
                                                                Promotion promotion) {
        if (request == null) {
            return null;
        }

        PromotionDateCondition condition = new PromotionDateCondition();
        condition.setPromotion(promotion);
        condition.setDayType(PromotionDayType.fromValue(request.getDayType()).getCode());

        return condition;
    }

    private List<PromotionRoomType> createPromotionRoomTypeCondition(List<PromotionRoomTypeRequest> requests,
                                                                     Promotion promotion) {
        if (requests == null || requests.isEmpty()) {
            return Collections.emptyList();
        }
        List<PromotionRoomType> list = new ArrayList<>();
        for (PromotionRoomTypeRequest request : requests) {
            PromotionRoomType condition = new PromotionRoomType();
            Category category = categoryRepository.findById(request.getRoomTypeId())
                    .orElseThrow(() -> new NotFoundException("room Type not found: " + request.getRoomTypeId()));
            condition.setRoomTypeId(category);
            condition.setExcluded(request.getExcluded());
            condition.setPromotion(promotion);
            list.add(condition);
        }
        return list;
    }
}
