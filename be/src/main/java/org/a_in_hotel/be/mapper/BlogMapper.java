package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.BlogDTO;
import org.a_in_hotel.be.dto.response.BlogResponse;
import org.a_in_hotel.be.entity.Blog;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.*;

import java.time.Instant;
import java.util.UUID;

@Mapper(componentModel = "spring",
        imports = {Instant.class, UUID.class},
        builder = @Builder(disableBuilder = true)
)
public interface BlogMapper extends CommonMapper {
    @Mapping(target = "id",ignore = true)
    @Mapping(target = "category.id",source = "dto.categoryId")
    @Mapping(target = "category.name",ignore = true)
    @Mapping(target = "tags", expression = "java(mapTagNames(dto.getTags()))")
    @Mapping(target = "image", ignore = true) // xử lý ảnh trong service
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "publishAt", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    Blog toEntity(BlogDTO dto,Long userId);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntityFromDto(BlogDTO dto, @MappingTarget Blog blog , Long userId);
    @Mapping(target = "categoryName",source = "category.name")
    @Mapping(target = "tags", expression = "java(mapTagsToNames(blog.getTags()))")
    @Mapping(target = "mediaUrls", expression = "java(mapImagesToUrls(blog))")
    BlogResponse toResponse(Blog blog);
}
