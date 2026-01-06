package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.AssetCreateRequest;
import org.a_in_hotel.be.dto.request.AssetUpdateRequest;
import org.a_in_hotel.be.dto.response.AssetResponse;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.util.SecurityUtils;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface AssetMapper  extends CommonMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", source = "dto.categoryId", qualifiedByName = "mapCategoryFromId")
    @Mapping(target = "room",source = "dto.roomId",qualifiedByName = "mapRoom")
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "updatedBy", ignore = true)
    @Mapping(target = "hotelId",source = "hotelId")
    Asset toEntity(AssetCreateRequest dto, Long hotelId);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "category", source = "categoryId", qualifiedByName = "mapCategoryFromId")
    @Mapping(target = "room",source = "roomId",qualifiedByName = "mapRoom")
    @Mapping(target = "updatedBy", ignore = true)
    void updateEntity(@MappingTarget Asset asset, AssetUpdateRequest dto);

    @Mapping(target = "categoryId",   source = "category.id")
    @Mapping(target = "categoryName", source = "category.name")
    @Mapping(target = "roomId",source = "room.id")
    @Mapping(target = "roomNumber",source = "room.roomNumber")
    @Mapping(target = "thumbnail", expression = "java(mapImageV2(entity.getId(),"
            + "\"Asset\",imageRepository))")
    @Mapping(target = "note",source = "note")
    AssetResponse toResponse(Asset entity, @Context ImageRepository imageRepository);

    List<AssetResponse> toResponses(List<Asset> assets);
}
