package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.RoomTypeRequest;
import org.a_in_hotel.be.entity.RoomType;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface RoomTypeMapper {
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    RoomType toEntity(RoomTypeRequest request,Long userId);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntity(RoomTypeRequest request, @MappingTarget RoomType entity, Long userId);
}
