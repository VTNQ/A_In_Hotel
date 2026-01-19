package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.PromotionRequest;
import org.a_in_hotel.be.dto.response.PromotionResponse;
import org.a_in_hotel.be.entity.Promotion;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.service.StaffService;
import org.mapstruct.Context;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",uses = {PromotionRoomTypeMapper.class})
public interface PromotionMapper extends CommonMapper {
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    Promotion toEntity(PromotionRequest request,Long userId);
    @Mapping(
            target = "createdBy",
            expression = "java(resolveCreatedBy(promotion.getCreatedBy(), accountService))"
    )
    @Mapping(
            target = "promotionRoomTypeResponses",
            source = "roomTypes"
    )
    PromotionResponse toResponse(Promotion promotion,@Context StaffService accountService);
}
