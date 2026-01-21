package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.HotelRequest;
import org.a_in_hotel.be.dto.request.HotelUpdate;
import org.a_in_hotel.be.dto.response.HotelResponse;
import org.a_in_hotel.be.entity.Account;
import org.a_in_hotel.be.entity.Hotel;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.repository.ImageRepository;
import org.a_in_hotel.be.repository.StaffRepository;
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
public interface HotelMapper  extends CommonMapper {
    @Mapping(target = "id", ignore = true)         // id auto gen
    @Mapping(target = "code", ignore = true)       // code sẽ generate sau
    @Mapping(source = "request.idUser", target = "account", qualifiedByName = "mapUserIdToAccount")
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    Hotel toEntity(HotelRequest request,Long userId);
    @Mapping(source = "createdAt", target = "createdAt", qualifiedByName = "instantToLong")
    @Mapping(source = "account.id", target = "fullName", qualifiedByName = "mapAccountIdToFullName")
    @Mapping(source = "account.id", target = "idUser")
    @Mapping(source = "hotlines",target = "hotlines")
    @Mapping(target = "thumbnail", expression = "java(mapImageV2(hotel.getId(),"
            + "\"hotel\",imageRepository))")
    HotelResponse toResponse(Hotel hotel,
                             @Context StaffRepository staffRepository,
                             @Context ImageRepository imageRepository);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)       // không cho update id
    @Mapping(target = "code", ignore = true)     // không cho update code
    @Mapping(source = "dto.idUser", target = "account", qualifiedByName = "mapUserIdToAccount")
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "hotlines",ignore = true)
    void updateEntity(HotelUpdate dto, @MappingTarget Hotel entity,Long userId);
}
