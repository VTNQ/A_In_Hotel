package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.AccountDTO;
import org.a_in_hotel.be.dto.response.AccountResponse;
import org.a_in_hotel.be.entity.Account;
import org.a_in_hotel.be.mapper.common.CommonMapper;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountMapper extends CommonMapper {
    @Mapping(target = "role", source = "idRole", qualifiedByName = "mapRoleFromId")
    Account toEntity(AccountDTO dto);
    @Mapping(target = "idRole", source = "role.id")
    AccountDTO toDTO(Account account);

    @Mapping(target = "email", source = "email")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "avatarUrl", source = "image.url")
    AccountResponse toResponse(Account account);
}
