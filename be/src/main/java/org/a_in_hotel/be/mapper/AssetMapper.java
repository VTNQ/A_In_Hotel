package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.AssetCreateRequest;
import org.a_in_hotel.be.dto.request.AssetUpdateRequest;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AssetMapper  extends CommonMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "mapCategory")
    @Mapping(target = "hotel", source = "hotelId", qualifiedByName = "mapHotel")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    Asset toEntity(AssetCreateRequest dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "mapCategory")
    @Mapping(target = "hotel", source = "hotelId", qualifiedByName = "mapHotel")
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(@MappingTarget Asset asset, AssetUpdateRequest dto);

    @Mapping(target = "categoryId",   source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "hotelId", source = "hotel.id")
    @Mapping(target = "hotelName",source = "hotel.name")
    AssetResponse toResponse(Asset entity);

}
