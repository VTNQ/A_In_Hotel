package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.FranchiseSectionItemRequest;
import org.a_in_hotel.be.dto.response.FranchiseSectionItemResponse;
import org.a_in_hotel.be.entity.FranchiseSectionItem;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.repository.ImageRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FranchiseSectionItemMapper extends CommonMapper {
    @Mapping(target = "createdBy",source = "userId")
    @Mapping(target = "updatedBy",source = "userId")
    FranchiseSectionItem toEntity(FranchiseSectionItemRequest request,Long userId);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "updatedBy",source = "userId")
    void update(FranchiseSectionItemRequest request, @MappingTarget FranchiseSectionItem franchiseSectionItem,Long userId);
    @Mapping(target = "sectionId",source = "section.id")
    @Mapping(target = "icon", expression = "java(mapImageV2(item.getId(),"
            + "\"franchise-section-item\",imageRepository))")
    FranchiseSectionItemResponse toResponse(FranchiseSectionItem item, @Context ImageRepository imageRepository);
}
