package org.a_in_hotel.be.mapper;


import org.a_in_hotel.be.dto.request.CategoryDTO;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CategoryMapper extends CommonMapper {

    CategoryDTO toDTO(Category entity);
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    Category toEntity(CategoryDTO dto,Long userId);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntityFromDTO(CategoryDTO dto, @MappingTarget Category entity,Long userId);
}
