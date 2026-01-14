package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.VoucherRequest;
import org.a_in_hotel.be.dto.response.VoucherResponse;
import org.a_in_hotel.be.entity.Voucher;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(componentModel = "spring")
public interface VoucherMapper extends CommonMapper {

    Voucher toEntity(VoucherRequest request);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(@MappingTarget Voucher voucher,VoucherRequest request);

    VoucherResponse toResponse(Voucher voucher);
}
