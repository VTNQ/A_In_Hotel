package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.response.RoomSwitchHistoryResponse;
import org.a_in_hotel.be.entity.RoomSwitchHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SwitchRoomHistoryMapper {
    @Mapping(target = "fromRoomTypeName",source = "fromRoomId.roomType.name")
    @Mapping(target = "toRoomTypeName",source = "toRoomId.roomType.name")
    RoomSwitchHistoryResponse toResponse(RoomSwitchHistory response);
}
