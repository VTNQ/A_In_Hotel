package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.Gender;
import org.a_in_hotel.be.dto.request.StaffRequest;
import org.a_in_hotel.be.dto.response.StaffResponse;
import org.a_in_hotel.be.entity.Staff;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring",imports = {Gender.class})
public interface StaffMapper extends CommonMapper {
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "hotelId",source = "hotelId")
    Staff toEntity(StaffRequest staffRequest,Long userId,Long hotelId);
    @Mapping(target = "email",source ="account.email")
    @Mapping(target = "id",source = "account.id")
    @Mapping(target = "isActive",source = "account.isActive")
    @Mapping(
            target = "gender",
            expression = "java(org.a_in_hotel.be.Enum.Gender.fromCode(staff.getGender()).getDescription())"
    )
    @Mapping(
            target = "role",
            source = "account.role.name",
            qualifiedByName = "capitalizeFirstLetter"
    )


    StaffResponse toResponse(Staff staff);
}
