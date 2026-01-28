package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.response.VoucherRoomTypeResponse;
import org.a_in_hotel.be.entity.VoucherRoomType;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface VoucherRoomTypeMapper {
    @Mapping(target = "roomTypeName",source = "roomTypeId.name")
    @Mapping(target = "roomTypeId",source = "roomTypeId.id")
    @Mapping(target = "excluded",source = "excluded")
    VoucherRoomTypeResponse toResponse(VoucherRoomType response);
}
