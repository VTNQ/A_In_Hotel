package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.response.PromotionRoomTypeResponse;
import org.a_in_hotel.be.entity.PromotionRoomType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PromotionRoomTypeMapper {
   @Mapping(target = "roomTypeName",source = "response.roomTypeId.name")
   PromotionRoomTypeResponse toResponse(PromotionRoomType response);
}
