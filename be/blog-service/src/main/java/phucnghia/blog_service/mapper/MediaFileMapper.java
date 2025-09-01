package phucnghia.blog_service.mapper;

import org.mapstruct.*;
import phucnghia.blog_service.dto.MediaFileDTO;
import phucnghia.blog_service.entity.Blog;
import phucnghia.blog_service.entity.MediaFile;

@Mapper(componentModel = "spring")
public interface MediaFileMapper {
    @Mapping(source = "blog.id", target = "blogId")
    MediaFileDTO toDTO(MediaFile entity);

    @Mapping(source = "blogId", target = "blog.id")
    MediaFile toEntity(MediaFileDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(MediaFileDTO dto, @MappingTarget MediaFile entity);
}
