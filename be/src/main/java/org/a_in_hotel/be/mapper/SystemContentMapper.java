package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.SystemContentRequest;
import org.a_in_hotel.be.dto.response.SystemContentResponse;
import org.a_in_hotel.be.entity.SystemContent;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SystemContentMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "title",source = "title")
    void updateEntity(SystemContentRequest request,@MappingTarget SystemContent entity);
    @Mapping(target = "backgroundImage",source = "backgroundImage")
    SystemContentResponse toResponse(SystemContent entity);
}
