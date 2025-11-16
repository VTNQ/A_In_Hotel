package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.BlogCategory;
import org.a_in_hotel.be.Enum.BlogStatus;
import org.a_in_hotel.be.dto.request.BlogRequest;
import org.a_in_hotel.be.dto.request.BlogUpdateRequest;
import org.a_in_hotel.be.dto.response.BlogResponse;
import org.a_in_hotel.be.entity.Blog;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.service.AccountService;
import org.a_in_hotel.be.service.StaffService;
import org.mapstruct.*;

@Mapper(componentModel = "spring", imports = {BlogStatus.class, BlogCategory.class})
public interface BlogMapper extends CommonMapper {
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    Blog toEntity(BlogRequest request,Long userId);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntity(BlogUpdateRequest request, @MappingTarget Blog blog, Long userId);
    @Mapping(
            target = "category",
            expression = "java(org.a_in_hotel.be.Enum.BlogCategory.fromCode(blog.getCategory()).getDescription())"
    )
    @Mapping(target = "categoryId",source = "category")
    @Mapping(target = "image", expression = "java(mapImage(blog.getThumbnail()))")

    @Mapping(
            target = "createdBy",
            expression = "java(resolveCreatedBy(blog.getCreatedBy(), accountService))"
    )
    BlogResponse toResponse(Blog blog, @Context StaffService accountService);
}
