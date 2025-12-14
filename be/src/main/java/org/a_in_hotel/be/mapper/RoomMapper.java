package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.RoomStatus;
import org.a_in_hotel.be.dto.request.RoomRequest;
import org.a_in_hotel.be.dto.response.RoomResponse;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.*;

@Mapper(componentModel = "spring",
imports = {RoomStatus.class})
public interface RoomMapper extends CommonMapper {

    // ========== CREATE ==========
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomType", source = "request.idRoomType", qualifiedByName = "mapRoomTypeFromId")
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "basePrice",source ="request.hourlyBasePrice")
    @Mapping(target = "additionalPrice",source = "request.hourlyAdditionalPrice")
    @Mapping(target = "updatedBy",  source = "userId")
    @Mapping(target = "hotel",source = "hotelId",qualifiedByName = "mapHotel")
    Room toEntity(RoomRequest request, Long userId,Long hotelId);

    // ========== UPDATE ==========
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomType", source = "request.idRoomType", qualifiedByName = "mapRoomTypeFromId")
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "basePrice",source ="request.hourlyBasePrice")

    @Mapping(target = "additionalPrice",source = "request.hourlyAdditionalPrice")
    void updateEntity(RoomRequest request, @MappingTarget Room entity, Long userId);
    // ========== RESPONSE ==========
    @Mapping(target = "roomTypeName", source = "roomType.name")
    @Mapping(target = "idRoomType",source = "roomType.id")
    @Mapping(target = "images", expression = "java(mapImages(room.getImages()))")
    @Mapping(target = "hourlyBasePrice", source = "basePrice")
    @Mapping(target = "hourlyAdditionalPrice", source = "additionalPrice")
    @Mapping(target = "overnightPrice", source = "overnightPrice")
    RoomResponse toResponse(Room room);
   
}
