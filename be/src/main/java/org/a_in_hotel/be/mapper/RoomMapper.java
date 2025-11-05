package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.CategoryType;
import org.a_in_hotel.be.Enum.PriceType;
import org.a_in_hotel.be.Enum.RoomStatus;
import org.a_in_hotel.be.dto.request.RoomRequest;
import org.a_in_hotel.be.dto.response.RoomResponse;
import org.a_in_hotel.be.entity.Room;
import org.a_in_hotel.be.entity.RoomPriceOption;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.*;

import java.util.ArrayList;
import java.util.List;

@Mapper(componentModel = "spring",
imports = {RoomStatus.class})
public interface RoomMapper extends CommonMapper {

    // ========== CREATE ==========
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomType", source = "request.idRoomType", qualifiedByName = "mapRoomTypeFromId")
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "roomPriceOptions", expression = "java(mapPriceOptions(request,room,userId))")
    Room toEntity(RoomRequest request, Long userId);

    // ========== UPDATE ==========
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "roomType", source = "request.idRoomType", qualifiedByName = "mapRoomTypeFromId")
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntity(RoomRequest request, @MappingTarget Room entity, Long userId);
    // ========== RESPONSE ==========
    @Mapping(target = "roomTypeName", source = "roomType.name")
    @Mapping(target = "idRoomType",source = "roomType.id")
    @Mapping(target = "images", expression = "java(mapImages(room.getImages()))")
    @Mapping(target = "hourlyBasePrice", expression = "java(getBigDecimalPrice(room, org.a_in_hotel.be.Enum.PriceType.HOURLY, \"basePrice\"))")
    @Mapping(target = "hourlyBaseDuration", expression = "java(getIntegerPrice(room, org.a_in_hotel.be.Enum.PriceType.HOURLY, \"baseDurationHours\"))")
    @Mapping(target = "hourlyAdditionalPrice", expression = "java(getBigDecimalPrice(room, org.a_in_hotel.be.Enum.PriceType.HOURLY, \"additionalPrice\"))")
    @Mapping(target = "overnightPrice", expression = "java(getBigDecimalPrice(room, org.a_in_hotel.be.Enum.PriceType.OVERNIGHT, \"basePrice\"))")
    RoomResponse toResponse(Room room);
   
}
