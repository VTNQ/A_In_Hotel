package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.ExtraServicePriceType;
import org.a_in_hotel.be.dto.request.ExtraServiceRequest;
import org.a_in_hotel.be.dto.response.ExtraServiceResponse;
import org.a_in_hotel.be.entity.ExtraService;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.*;

@Mapper(componentModel = "spring",imports = {ExtraServicePriceType.class})
public interface ExtraServiceMapper extends CommonMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", source = "request.categoryId", qualifiedByName = "mapCategoryFromId")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "priceType",source = "request.priceType")
    ExtraService toEntity(ExtraServiceRequest request, Long userId);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", source = "request.categoryId", qualifiedByName = "mapCategoryFromId")
    @Mapping(target = "updatedBy", source = "userId")
    void updateEntityFromDto(ExtraServiceRequest request, @MappingTarget ExtraService dto,Long userId);

    @Mapping(target = "categoryName",source = "category.name")
    @Mapping(target = "categoryId",source = "category.id")
    @Mapping(
            target = "priceType",
            expression = "java(org.a_in_hotel.be.Enum.ExtraServicePriceType.fromCode(service.getPriceType()).getDescription())"
    )
    ExtraServiceResponse toResponse(ExtraService service);
}
