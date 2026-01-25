package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.PromotionRequest;
import org.a_in_hotel.be.dto.response.PromotionResponse;
import org.a_in_hotel.be.entity.Promotion;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.service.StaffService;
import org.mapstruct.*;

@Mapper(componentModel = "spring",uses = {PromotionRoomTypeMapper.class})
public interface PromotionMapper extends CommonMapper {
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    Promotion toEntity(PromotionRequest request,Long userId);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntity(@MappingTarget Promotion promotion,PromotionRequest request,Long userId);
    @Mapping(
            target = "createdBy",
            expression = "java(resolveCreatedBy(promotion.getCreatedBy(), accountService))"
    )
    @Mapping(
            target = "promotionRoomTypeResponses",
            source = "roomTypes"
    )
    @Mapping(target = "bookingType",source = "bookingCondition.bookingType")
    @Mapping(target = "minNights",source = "bookingCondition.minNights" )
    @Mapping(target = "customerType",source = "customerCondition.customerType")
    PromotionResponse toResponse(Promotion promotion,@Context StaffService accountService);
}
