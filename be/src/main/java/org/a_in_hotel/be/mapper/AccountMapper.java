package org.a_in_hotel.be.mapper;

import org.a_in_hotel.be.dto.request.AccountDTO;
import org.a_in_hotel.be.dto.response.AccountResponse;
import org.a_in_hotel.be.entity.Account;
import org.a_in_hotel.be.entity.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(target = "role", source = "idRole", qualifiedByName = "mapRoleFromId")
    Account toEntity(AccountDTO dto);
    @Mapping(target = "idRole", source = "role.id")
    AccountDTO toDTO(Account account);
    @Named("mapRoleFromId")
    default Role mapRoleFromId(Long idRole) {
        if (idRole == null) return null;
        Role role = new Role();
        role.setId(idRole);
        return role;
    }
    @Mapping(target = "email", source = "email")
    @Mapping(target = "id", source = "id")
    @Mapping(target = "avatarUrl", source = "image.url")
    AccountResponse toResponse(Account account);
}
