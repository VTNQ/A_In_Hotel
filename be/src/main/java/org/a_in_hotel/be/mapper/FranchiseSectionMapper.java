package org.a_in_hotel.be.mapper;
import org.a_in_hotel.be.dto.request.FranchiseSectionRequest;
import org.a_in_hotel.be.dto.response.FranchiseSectionResponse;
import org.a_in_hotel.be.entity.FranchiseSection;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FranchiseSectionMapper {
    @Mapping(target = "createdBy",source = "userId")
    @Mapping(target = "updatedBy",source = "userId")
    FranchiseSection  toEntity(FranchiseSectionRequest request,Long userId);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "active", source = "request.active")
    void updateEntity(FranchiseSectionRequest request, @MappingTarget FranchiseSection franchise,Long userId);
    FranchiseSectionResponse toResponse(FranchiseSection franchise);
}
