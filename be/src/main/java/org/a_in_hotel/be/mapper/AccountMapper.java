package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.Enum.Gender;
import org.a_in_hotel.be.dto.request.AccountDTO;
import org.a_in_hotel.be.dto.request.ProfileSystemRequest;
import org.a_in_hotel.be.dto.request.StaffRequest;
import org.a_in_hotel.be.dto.request.UserDTO;
import org.a_in_hotel.be.dto.response.AccountResponse;
import org.a_in_hotel.be.dto.response.ProfileSystemResponse;
import org.a_in_hotel.be.entity.Account;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.a_in_hotel.be.repository.ImageRepository;
import org.mapstruct.*;

@Mapper(componentModel = "spring",imports = {Gender.class})
public interface AccountMapper extends CommonMapper {
    @Mapping(target = "role", source = "idRole", qualifiedByName = "mapRoleFromId")
    Account toEntity(AccountDTO dto);
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "staff.fullName",source = "dto.fullName")
    @Mapping(target = "staff.phone",source = "dto.phone")
    @Mapping(target = "staff.birthday",source = "dto.birthday")
    @Mapping(target = "staff.gender",source = "dto.gender")
    @Mapping(target = "updatedBy", source = "userId")
    void toProfileEntity(@MappingTarget Account account,ProfileSystemRequest dto,Long userId);

    Account toEntityUser(UserDTO dto);
    @Mapping(target = "role",source = "dto.idRole",qualifiedByName = "mapRoleFromId")
    @Mapping(target = "createdBy", source = "userId")
    @Mapping(target = "updatedBy", source = "userId")
    @Mapping(target = "isActive",source = "dto.isActive")
    Account toEntityStaff(StaffRequest dto,Long userId);
    @Mapping(target = "idRole", source = "role.id")
    AccountDTO toDTO(Account account);

    @Mapping(target = "email", source = "email")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "avatarUrl", source = "image.url")
    @Mapping(target = "fullName",source = "staff.fullName")
    @Mapping(
            target = "gender",
            expression = "java(org.a_in_hotel.be.Enum.Gender.fromCode(account.getStaff().getGender()).getDescription())"
    )
    @Mapping(target = "phone",source = "staff.phone")
    @Mapping(target = "birthday",source = "staff.birthday")
    AccountResponse toResponse(Account account);
    @Mapping(target = "staffCode",source = "account.staff.staffCode")
    @Mapping(target = "fullName",source = "account.staff.fullName")
    @Mapping(target = "birthday",source = "account.staff.birthday")
    @Mapping(target = "gender",source = "account.staff.gender")
    @Mapping(target = "hotelName",source = "account.hotel.name")
    @Mapping(target = "phone",source = "account.staff.phone")
    ProfileSystemResponse toProfile(Account account);
}
