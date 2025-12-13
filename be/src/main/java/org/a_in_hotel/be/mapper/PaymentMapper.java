package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.PaymentType;
import org.a_in_hotel.be.dto.request.BookingRequest;
import org.a_in_hotel.be.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring",imports = {PaymentType.class})
public interface PaymentMapper {
    @Mapping(target = "paidAmount",source = "paidAmount")
    @Mapping(target = "paymentType",
            expression = "java( request.getPaymentType() != null ? PaymentType.fromValue(request.getPaymentType())"
                         + ".getValue() : null )")
    Payment toEntity(BookingRequest request);
}
