package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.TagDTO;
import org.a_in_hotel.be.entity.Tag;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
@Mapper(componentModel = "spring")
public interface TagMapper {
    TagDTO toDTO(Tag entity);
    Tag toEntity(TagDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(TagDTO dto, @MappingTarget Tag entity);
}
