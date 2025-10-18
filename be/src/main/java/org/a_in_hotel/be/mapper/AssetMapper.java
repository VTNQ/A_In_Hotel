package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.AssetCreateRequest;
import org.a_in_hotel.be.dto.request.AssetUpdateRequest;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.Room;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface AssetMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "mapCategory")
    @Mapping(target = "room", source = "roomId", qualifiedByName = "mapRoom")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "previousStatus", ignore = true)
    Asset toEntity(AssetCreateRequest dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "mapCategory")
    @Mapping(target = "room", source = "roomId", qualifiedByName = "mapRoom")
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "previousStatus", ignore = true)
    void updateEntity(@MappingTarget Asset asset, AssetUpdateRequest dto);

    @Mapping(target = "categoryId",   source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "roomId", source = "room.id")
    @Mapping(target = "roomName",     source = "room.roomNumber")
    AssetResponse toResponse(Asset entity);

    @Named("mapCategory")
    default Category mapCategory(Long id) {
        if (id == null) return null;
        Category c = new Category(); c.setId(id);
        return c;
    }

    @Named("mapRoom")
    default Room mapRoom(Long id) {
        if (id == null) return null;
        Room r = new Room(); r.setId(id);
        return r;
    }
}
