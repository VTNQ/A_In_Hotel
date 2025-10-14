package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.RoomRequest;
import org.a_in_hotel.be.dto.response.ImageRoomResponse;
import org.a_in_hotel.be.dto.response.RoomResponse;
import org.a_in_hotel.be.entity.Image;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.entity.RoomType;
import org.mapstruct.*;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface RoomMapper {

    // ========== CREATE ==========
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomType", source = "request.idRoomType", qualifiedByName = "mapRoomTypeFromId")
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    Room toEntity(RoomRequest request, Long userId);

    // ========== UPDATE ==========
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomType", source = "request.idRoomType", qualifiedByName = "mapRoomTypeFromId")
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntity(RoomRequest request, @MappingTarget Room entity, Long userId);

    // ========== Helper ==========
    @Named("mapRoomTypeFromId")
    default RoomType mapRoomTypeFromId(Long idRoomType) {
        if (idRoomType == null) return null;
        RoomType roomType = new RoomType();
        roomType.setId(idRoomType);
        return roomType;
    }

    // ========== RESPONSE ==========
    @Mapping(target = "roomTypeName", source = "roomType.name")
    @Mapping(target = "status", expression = "java(room.getStatus().name())")
    @Mapping(target = "images", expression = "java(mapImages(room.getImages()))")
    RoomResponse toResponse(Room room);

    // ========== IMAGE HELPER ==========
    default List<ImageRoomResponse> mapImages(List<Image> images) {
        if (images == null) return List.of();
        return images.stream()
                .filter(img -> "Room".equalsIgnoreCase(img.getEntityType()))
                .map(img -> new ImageRoomResponse(img.getUrl(), img.getAltText()))
                .collect(Collectors.toList());
    }
}
