package com.example.hotelservice.mapper;

import com.example.hotelservice.dto.request.HotelRequest;
import com.example.hotelservice.dto.request.HotelUpdate;
import com.example.hotelservice.dto.response.HotelResponse;
import com.example.hotelservice.dto.response.User;
import com.example.hotelservice.entity.Hotel;
import org.mapstruct.*;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@Mapper(
        componentModel = "spring",
        imports = {Instant.class, UUID.class},
        builder = @org.mapstruct.Builder(disableBuilder = true) // ⭐ TẮT builder
)
public interface HotelMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(target = "code", expression = "java(com.example.hotelservice.mapper.HotelMapper.generateBranchCode())")
    Hotel toEntity(HotelRequest branch);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "code", ignore = true)
    void updateEntityFromDto(HotelUpdate dto, @MappingTarget Hotel entity);
    @Mapping(source = "createdAt",target = "createdAt",qualifiedByName = "instantToLong")
    @Mapping(source = "status",    target = "status")
    HotelResponse toResponse(Hotel hotel);
    default HotelResponse toResponse(Hotel hotel, User user) {
        if(hotel == null) return null;
        HotelResponse response = toResponse(hotel);
        if(user!=null){
            response.setIdUser(user.getAccountId());
            response.setFullName(user.getFullName());

        }
        return response;
    }
    default List<HotelResponse>toResponse(List<Hotel>hotels,List<User> users){
        if(hotels == null || hotels.isEmpty())return List.of();
        Map<Long, User> userMap = (users == null) ? Map.of()
                : users.stream()
                .filter(Objects::nonNull)
                .filter(u -> u.getAccountId() != null)
                .collect(Collectors.toMap(
                        User::getAccountId,
                        Function.identity(),
                        (a, b) -> a // giữ bản đầu nếu trùng id
                ));
        return hotels.stream().map(hotel -> toResponse(hotel,userMap.get(hotel.getIdUser()))).collect(Collectors.toList());
    }
    static String generateBranchCode() {
        String prefix = "HCM";
        return prefix + "-" + UUID.randomUUID().toString();
    }
    @Named("instantToLong")
     static Long instantToLong(Instant instant) {
        return instant !=null ? instant.toEpochMilli() : null;
    }
}
