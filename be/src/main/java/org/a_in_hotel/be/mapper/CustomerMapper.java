package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.BookingRequest;
import org.a_in_hotel.be.dto.request.UserDTO;
import org.a_in_hotel.be.dto.response.CustomerProfileResponse;
import org.a_in_hotel.be.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(
        componentModel = "spring"
)
public interface CustomerMapper {
    @Mapping(target = "firstName",source = "request.guestName")
    @Mapping(target = "lastName",source = "request.surname")
    @Mapping(target = "phoneNumber",source = "request.phoneNumber")
    @Mapping(target = "hotelId",source = "hotelId")
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    Customer toEntity(BookingRequest request,Long hotelId,Long userId);

    @Mapping(target = "phoneNumber",source = "phone")
    Customer toEntityUser(UserDTO userDTO);

    @Mapping(target = "email",source = "account.email")
    CustomerProfileResponse toProfile(Customer customer);
}
