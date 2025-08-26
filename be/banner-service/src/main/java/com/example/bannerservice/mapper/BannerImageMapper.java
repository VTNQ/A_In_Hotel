package com.example.bannerservice.mapper;

import com.example.bannerservice.dto.response.FileUploadMeta;
import com.example.bannerservice.entity.BannerImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.time.Instant;
import java.util.UUID;

@Mapper(
        componentModel ="spring",
        imports = {Instant.class, UUID.class},
        builder = @org.mapstruct.Builder(disableBuilder = true)
)
public interface BannerImageMapper {
    @Mapping(target = "id",ignore = true)
    BannerImage toBannerImage(FileUploadMeta  fileUploadMeta);
}
