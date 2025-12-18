package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.BannerRequest;
import org.a_in_hotel.be.dto.response.BannerResponse;
import org.a_in_hotel.be.entity.Banner;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.repository.ImageRepository;
import org.mapstruct.*;

import java.time.Instant;
import java.util.UUID;

@Mapper(
        componentModel ="spring",
        imports = {Instant.class, UUID.class},
        builder = @Builder(disableBuilder = true)
)
public interface BannerMapper extends CommonMapper {
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    Banner toEntity(BannerRequest bannerRequest,Long userId);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntityFromDto(BannerRequest bannerRequest, @MappingTarget Banner banner,Long userId);

    @Mapping(target = "image", expression = "java(mapImageV2(banner.getId(),"
                                            + "\"banner\",imageRepository))")
    BannerResponse toResponse(Banner banner,@Context ImageRepository imageRepository);
}
