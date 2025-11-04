package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.AssetCreateRequest;
import org.a_in_hotel.be.dto.request.AssetUpdateRequest;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.util.SecurityUtils;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AssetMapper  extends CommonMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "mapCategoryFromId")
    @Mapping(target = "room",source = "roomId",qualifiedByName = "mapRoom")
    @Mapping(target = "hotel", expression = "java(mapHotelFromToken(securityUtils))")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Asset toEntity(AssetCreateRequest dto, @Context SecurityUtils securityUtils);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "mapCategoryFromId")
    @Mapping(target = "hotel", expression = "java(mapHotelFromToken(securityUtils))")
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(@MappingTarget Asset asset, AssetUpdateRequest dto,@Context SecurityUtils securityUtils);

    @Mapping(target = "categoryId",   source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "hotelId", source = "hotel.id")
    @Mapping(target = "roomId",source = "room.id")
    @Mapping(target = "roomName",source = "room.roomName")
    @Mapping(target = "hotelName",source = "hotel.name")
    @Mapping(target = "note",source = "note")
    AssetResponse toResponse(Asset entity);

}
