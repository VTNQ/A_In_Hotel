package org.a_in_hotel.be.mapper;


import org.a_in_hotel.be.dto.request.CategoryDTO;
import org.a_in_hotel.be.dto.response.*;
import org.a_in_hotel.be.entity.Asset;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.*;

import java.util.List;

@Mapper(
        componentModel = "spring", imports = {org.a_in_hotel.be.Enum.CategoryType.class}
)
public interface CategoryMapper extends CommonMapper {
    @Mapping(target = "type", expression = "java(CategoryType.fromCode(entity.getType()).name())")
    @Mapping(target = "idType",source = "type")
    @Mapping(target = "description",source = "description")
    CategoryResponse toDTO(Category entity);
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "isActive",ignore = true)
    Category toEntity(CategoryDTO dto,Long userId);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntityFromDTO(CategoryDTO dto, @MappingTarget Category entity,Long userId);
    @Mapping(target = "name", source = "name")
    @Mapping(target = "description", source = "description")
    @Mapping(target = "roomImage", expression = "java(mapRoomImage(category))")
    @Mapping(target = "assets", expression = "java(mapAssets(category))")
    RoomTypeResponse toRoomTypeResponse(Category category);
    default ImageResponse mapRoomImage(Category category) {
        if (category.getRooms() == null || category.getRooms().isEmpty()) {
            return null;
        }

        Room room = category.getRooms().get(0);

        if (room.getImages() == null || room.getImages().isEmpty()) {
            return null;
        }

        return mapImage(room.getImages().get(0));
    }


    default List<AssetResponseOfHotel> mapAssets(Category category) {
        if (category.getRooms() == null) {
            return null;
        }

        return category.getRooms().stream()
                .filter(r -> r.getAssets() != null)
                .flatMap(r -> r.getAssets().stream())
                .map(this::toAssetResponse)
                .distinct()
                .toList();
    }
    @Mapping(target = "thumbnail", expression = "java(mapImage(asset.getThumbnail()))")
    @Mapping(target = "assetName", source = "assetName")
    AssetResponseOfHotel toAssetResponse(Asset asset);

}
