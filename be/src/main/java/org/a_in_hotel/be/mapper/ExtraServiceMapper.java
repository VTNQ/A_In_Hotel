package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.ExtraServiceRequest;
import org.a_in_hotel.be.dto.response.ExtraServiceResponse;
import org.a_in_hotel.be.entity.Category;
import org.a_in_hotel.be.entity.ExtraService;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ExtraServiceMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", source = "request.categoryId", qualifiedByName = "mapCategoryFromId")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    ExtraService toEntity(ExtraServiceRequest request, Long userId);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", source = "request.categoryId", qualifiedByName = "mapCategoryFromId")
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntityFromDto(ExtraServiceRequest request, @MappingTarget ExtraService dto,Long userId);
    @Named("mapCategoryFromId")
    default Category mapCategoryFromId(Long idCategory) {
        if (idCategory == null) return null;
        Category category = new Category();
        category.setId(idCategory);
        return category;
    }
    @Mapping(target = "categoryName",source = "category.name")
    ExtraServiceResponse toResponse(ExtraService service);
}
