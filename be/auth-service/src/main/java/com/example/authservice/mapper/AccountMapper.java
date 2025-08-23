package com.example.authservice.mapper;

import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.dto.response.AccountResponse;
import com.example.authservice.dto.response.User;
import com.example.authservice.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.List;
import java.util.Map;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(target = "email", source = "email")
    @Mapping(target = "id", source = "id")
    AccountResponse toResponse(Account account);
    AccountDTO toDTO(Account account);
    default Page<AccountDTO> toResponse(Page<Account> accounts, Map<Long, User> userById) {
        List<AccountDTO> content = accounts.getContent().stream()
                .map(acc -> {
                    AccountDTO dto = toDTO(acc);
                    if (acc != null && acc.getId() != null) {
                        User u = userById.get(acc.getId());
                        if (u != null) {

                            dto.setFullName(u.getFullName()); // đổi theo field thực tế
                            dto.setPhone(u.getPhone());       // đổi theo field thực tế
                        }
                    }
                    return dto;
                })
                .toList();

        return new PageImpl<>(content, accounts.getPageable(), accounts.getTotalElements());
    }
}
