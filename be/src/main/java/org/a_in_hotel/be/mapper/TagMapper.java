package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.TagDTO;
import org.a_in_hotel.be.entity.Tag;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TagMapper {
    TagDTO toDTO(Tag entity);
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    Tag toEntity(TagDTO dto,Long userId);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntityFromDTO(TagDTO dto, @MappingTarget Tag entity,Long userId);
}
