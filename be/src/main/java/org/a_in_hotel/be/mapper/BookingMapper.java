package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.BookingPackage;
import org.a_in_hotel.be.Enum.BookingStatus;
import org.a_in_hotel.be.Enum.GuestType;
import org.a_in_hotel.be.dto.request.BookingRequest;
import org.a_in_hotel.be.dto.request.EditGuestRequest;
import org.a_in_hotel.be.dto.request.PaymentRequest;
import org.a_in_hotel.be.dto.response.BookingResponse;
import org.a_in_hotel.be.entity.Booking;
import org.a_in_hotel.be.entity.Payment;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.repository.ExtraServiceRepository;
import org.a_in_hotel.be.repository.RoomRepository;
import org.mapstruct.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Mapper(componentModel = "spring", imports = {GuestType.class, BookingPackage.class, BookingStatus.class},
        uses = { BookingDetailMapper.class, SwitchRoomHistoryMapper.class } )
public interface BookingMapper extends CommonMapper {
    @Mappings({
            @Mapping(target = "guestType",
                    expression = "java( request.getGuestType() != null ? GuestType.fromCode(request.getGuestType())"
                                 + ".getCode() : null )"),

            @Mapping(target = "bookingPackage",
                    expression = "java( request.getBookingPackage() != null ? BookingPackage.getBookingPackage"
                                 + "(request.getBookingPackage()).getCode() : null )"),

            @Mapping(target = "createdBy", source = "userId"),
            @Mapping(target = "hotelId",source = "hotelId"),
            @Mapping(target = "updatedBy", source = "userId"),
            @Mapping(target = "payment", ignore = true)
    })

    Booking toEntity(
            BookingRequest request,
            @Context BookingDetailMapper detailMapper,
            @Context RoomRepository roomRepository,
            @Context ExtraServiceRepository extraServiceRepository,
            Long userId,
            Long hotelId);
    default List<Payment> mapPaymentRequestToList(PaymentRequest request) {
        if (request == null) return new ArrayList<>();


        Payment payment = new Payment();


        return Collections.singletonList(payment);
    }
    @AfterMapping
    default void mapDetails(
            BookingRequest request,
            @MappingTarget Booking booking,
            @Context BookingDetailMapper detailMapper,
            @Context RoomRepository roomRepository,
            @Context ExtraServiceRepository extraServiceRepository,
            Long userId
                           ) {
        if (request.getBookingDetail() == null)
            return;

        booking.setDetails(
                CommonMapper.super.mapDetails(
                        request.getBookingDetail(),
                        booking,
                        detailMapper,
                        roomRepository,
                        extraServiceRepository,
                        userId));
    }


    @Mapping(target = "payment",source = "payment")
    BookingResponse toResponse(Booking booking);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntity(@MappingTarget Booking booking, EditGuestRequest request);
}
