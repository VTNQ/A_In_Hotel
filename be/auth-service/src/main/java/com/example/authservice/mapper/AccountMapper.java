package com.example.authservice.mapper;

import com.example.authservice.dto.response.AccountResponse;
import com.example.authservice.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(target = "email", source = "email")
    @Mapping(target = "id", source = "id")
    AccountResponse toResponse(Account account);
}
