package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.BookingPackage;
import org.a_in_hotel.be.Enum.PromotionCustomerType;
import org.a_in_hotel.be.Enum.UsageType;
import org.a_in_hotel.be.dto.request.VoucherRequest;
import org.a_in_hotel.be.dto.response.VoucherResponse;
import org.a_in_hotel.be.entity.Voucher;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.service.StaffService;
import org.mapstruct.*;

@Mapper(componentModel = "spring",imports = {BookingPackage.class, PromotionCustomerType.class, UsageType.class},
uses = VoucherRoomTypeMapper.class)
public interface VoucherMapper extends CommonMapper {
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "bookingType",expression = "java(request.getBookingType()!=null ? BookingPackage.getBookingPackage(request.getBookingType())" +
            ".getCode():null)")
    @Mapping(target = "customerType",expression = "java(request.getCustomerType()!=null ? PromotionCustomerType.fromValue(request.getCustomerType())" +
            ".getCode():null)")
    @Mapping(target = "usageType",expression = "java(request.getUsageType()!=null ? UsageType.fromValue(request.getUsageType()" +
            ").getCode():null)")
    @Mapping(target ="roomTypes",ignore = true )
    Voucher toEntity(VoucherRequest request,Long userId);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target ="roomTypes",ignore = true )
    void updateEntity(@MappingTarget Voucher voucher,VoucherRequest request,Long userId);
    @Mapping(
            target = "createdBy",
            expression = "java(resolveCreatedBy(voucher.getCreatedBy(), accountService))"
    )
    VoucherResponse toResponse(Voucher voucher,@Context StaffService accountService);
}
