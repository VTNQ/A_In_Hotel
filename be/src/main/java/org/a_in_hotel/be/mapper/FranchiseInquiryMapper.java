package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.FranchiseInquiryRequest;
import org.a_in_hotel.be.dto.response.FranchiseInquiryResponse;
import org.a_in_hotel.be.entity.FranchiseInquiry;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface FranchiseInquiryMapper {
    @Mapping(target = "createdBy",source = "userId")
    FranchiseInquiry toEntity(FranchiseInquiryRequest request,Long userId);

    FranchiseInquiryResponse toResponse(FranchiseInquiry inquiry);

}
