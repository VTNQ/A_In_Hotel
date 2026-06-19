package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.FranchiseRequest;
import org.a_in_hotel.be.dto.response.FranchiseResponse;
import org.a_in_hotel.be.entity.Franchise;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.repository.ImageRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FranchiseMapper extends CommonMapper {
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "franchise.metaKeywords",source = "request.metaKeywords")
    Franchise toEntity(@MappingTarget Franchise franchise, FranchiseRequest request, Long userId);
    @Mapping(target = "bannerImage", expression = "java(mapImageV2(franchise.getId(),"
            + "\"franchise\",imageRepository))")
    FranchiseResponse toResponse(Franchise franchise, @Context ImageRepository imageRepository);
}
