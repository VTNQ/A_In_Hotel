package com.example.bannerservice.mapper;

import com.example.bannerservice.dto.request.BannerRequest;
import com.example.bannerservice.entity.Banner;
import org.mapstruct.*;

import java.time.Instant;
import java.util.UUID;

@Mapper(
        componentModel ="spring",
        imports = {Instant.class, UUID.class},
        builder = @org.mapstruct.Builder(disableBuilder = true)
)
public interface BannerMapper {
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "categories",ignore = true)
    Banner toEntity(BannerRequest bannerRequest);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id",ignore = true)
    void updateEntityFromDto(BannerRequest bannerRequest, @MappingTarget Banner banner);
}
