package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.HotelHotlineRequest;
import org.a_in_hotel.be.entity.HotelHotline;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface HotelHotlineMapper {

    HotelHotline toEntity(HotelHotlineRequest request);
}
