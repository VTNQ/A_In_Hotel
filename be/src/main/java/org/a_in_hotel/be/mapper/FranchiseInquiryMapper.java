package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.FranchiseInquiryRequest;
import org.a_in_hotel.be.dto.response.FranchiseInquiryResponse;
import org.a_in_hotel.be.entity.FranchiseInquiry;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FranchiseInquiryMapper {
    @Mapping(target = "createdBy",source = "userId")
    @Mapping(target = "propertyLocation",source = "request.propertyLocation")
    @Mapping(target = "landArea",source = "request.landArea")
    @Mapping(target = "roomCount",source = "request.roomCount")
    FranchiseInquiry toEntity(FranchiseInquiryRequest request,Long userId);
    @Mapping(target = "propertyLocation",source = "propertyLocation")
    @Mapping(target = "landArea",source = "landArea")
    @Mapping(target = "roomCount",source = "roomCount")
    FranchiseInquiryResponse toResponse(FranchiseInquiry inquiry);

}
