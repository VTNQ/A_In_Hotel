package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.BannerRequest;
import org.a_in_hotel.be.entity.Banner;
import org.mapstruct.*;

import java.time.Instant;
import java.util.UUID;

@Mapper(
        componentModel ="spring",
        imports = {Instant.class, UUID.class},
        builder = @Builder(disableBuilder = true)
)
public interface BannerMapper {
    @Mapping(target = "id",ignore = true)
    Banner toEntity(BannerRequest bannerRequest);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id",ignore = true)
    void updateEntityFromDto(BannerRequest bannerRequest, @MappingTarget Banner banner);
}
