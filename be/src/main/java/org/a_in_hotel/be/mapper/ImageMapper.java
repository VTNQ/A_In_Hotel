package org.a_in_hotel.be.mapper;


import org.a_in_hotel.be.dto.response.FileUploadMeta;
import org.a_in_hotel.be.entity.Image;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.Instant;
import java.util.UUID;

@Mapper(
        componentModel ="spring",
        imports = {Instant.class, UUID.class},
        builder = @org.mapstruct.Builder(disableBuilder = true)
)
public interface ImageMapper {
    @Mapping(target = "id",ignore = true)
    Image toBannerImage(FileUploadMeta fileUploadMeta);
}
