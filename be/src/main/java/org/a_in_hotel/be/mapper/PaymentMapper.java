package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.PaymentType;
import org.a_in_hotel.be.dto.request.BookingRequest;
import org.a_in_hotel.be.entity.Booking;
import org.a_in_hotel.be.entity.Payment;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.math.BigDecimal;

@Mapper(componentModel = "spring",imports = {PaymentType.class})
public interface PaymentMapper {
    @Mapping(target = "paidAmount",source = "payment.paidAmount")
    @Mapping(target = "paymentType",
            expression = "java( request.getPayment().getPaymentType() != null ? PaymentType.fromValue(request.getPayment().getPaymentType())"
                         + ".getValue() : null )")
    @Mapping(target = "notes",source = "payment.notes")
    Payment toEntity(BookingRequest request);

    @Mappings({
            @Mapping(target = "paidAmount", source = "amount"),
            @Mapping(target = "paymentType",
                    expression = "java(type.getValue())"),
            @Mapping(target = "booking", source = "booking"),
            @Mapping(target = "id", ignore = true)
    })
    Payment toEntity(
            BigDecimal amount,
            PaymentType type,
            Booking booking
    );
}
