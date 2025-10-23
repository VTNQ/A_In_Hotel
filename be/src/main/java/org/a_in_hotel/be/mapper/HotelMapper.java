package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.HotelRequest;
import org.a_in_hotel.be.dto.request.HotelUpdate;
import org.a_in_hotel.be.dto.response.HotelResponse;
import org.a_in_hotel.be.entity.Account;
import org.a_in_hotel.be.entity.Hotel;
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
    @Mapping(target = "id", ignore = true)         // id auto gen
    @Mapping(target = "code", ignore = true)       // code sẽ generate sau
    @Mapping(target = "status", constant = "ACTIVE")
    @Mapping(source = "idUser", target = "account", qualifiedByName = "mapUserIdToAccount")
    Hotel toEntity(HotelRequest request);
    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "instantToLong")
    @Mapping(source = "account.fullName", target = "fullName")
    @Mapping(source = "account.id", target = "idUser")
    HotelResponse toResponse(Hotel hotel);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)       // không cho update id
    @Mapping(target = "code", ignore = true)     // không cho update code
    @Mapping(source = "idUser", target = "account", qualifiedByName = "mapUserIdToAccount")
    void updateEntity(HotelUpdate dto, @MappingTarget Hotel entity);
    @Named("mapUserIdToAccount")
    default Account mapUserIdToAccount(Long idUser) {
        if (idUser == null) return null;
        Account acc = new Account();
        acc.setId(idUser);
        return acc;
    }

    @Named("instantToLong")
    static Long instantToLong(Instant instant) {
        return instant != null ? instant.toEpochMilli() : null;
    }
}
