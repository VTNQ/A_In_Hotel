package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.response.DetailCustomerResponse;
import org.a_in_hotel.be.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CustomerDetailMapper {
    @Mapping(target = "customerCode", source = "customer.customerCode")
    @Mapping(target = "phone", source = "customer.phoneNumber")
    @Mapping(target = "email", source = "customer.account.email")
    @Mapping(
            target = "fullName",
            expression = "java(customer.getFirstName() + \" \" + customer.getLastName())"
    )
    @Mapping(target = "blocked",source = "customer.blocked")
    @Mapping(target = "nationality", source = "customer.nationality")
    @Mapping(target = "availablePoint", source = "customer.points")
    @Mapping(target = "usedPoint", source = "usedPoint")
    @Mapping(
            target = "totalPoint",
            expression = "java(customer.getPoints() + usedPoint)"
    )
    DetailCustomerResponse toDetailResponse(
            Customer customer,
            Integer usedPoint
    );
}
