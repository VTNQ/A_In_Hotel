package com.example.bannerservice.mapper;

import com.example.bannerservice.dto.request.CategoryRequest;
import com.example.bannerservice.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.time.Instant;
import java.util.UUID;

@Mapper(
        componentModel = "spring",
        imports = {Instant.class, UUID.class},
        builder = @org.mapstruct.Builder(disableBuilder = true) // ⭐ TẮT builder
)
public interface CategoryMapper {
    @Mapping(target = "id", ignore = true)
    Category toEntity(CategoryRequest request);
    void toUpdate(CategoryRequest request, @MappingTarget Category category);
}
