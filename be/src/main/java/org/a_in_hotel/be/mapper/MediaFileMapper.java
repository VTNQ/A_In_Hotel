package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.MediaFileDTO;
import org.a_in_hotel.be.entity.MediaFile;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface MediaFileMapper {
    @Mapping(source = "blog.id", target = "blogId")
    MediaFileDTO toDTO(MediaFile entity);

    @Mapping(source = "blogId", target = "blog.id")
    MediaFile toEntity(MediaFileDTO dto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDTO(MediaFileDTO dto, @MappingTarget MediaFile entity);
}
