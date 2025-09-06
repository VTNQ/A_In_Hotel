package phucnghia.blog_service.mapper;

import org.mapstruct.*;
import phucnghia.blog_service.dto.TagDTO;
import phucnghia.blog_service.entity.Tag;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagDTO toDTO(Tag entity);
    Tag toEntity(TagDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(TagDTO dto, @MappingTarget Tag entity);
}
