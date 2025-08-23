package com.example.authservice.mapper;

import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.dto.response.AccountResponse;
import com.example.authservice.dto.response.User;
import com.example.authservice.entity.Account;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface AccountMapper {
    @Mapping(target = "email", source = "email")
    @Mapping(target = "id", source = "id")
    AccountResponse toResponse(Account account);
    @Mapping(target = "password",ignore = true)
    AccountDTO toDTO(Account account);
    @Mapping(target = "password",ignore = true)
    default Page<AccountDTO> toResponse(Page<Account> accounts, List<User> users) {
        if (accounts == null) return Page.empty();

        // Tạo map: accountId -> User
        Map<Long, User> userByAccountId = new HashMap<>();
        if (users != null) {
            for (User u : users) {
                if (u != null && u.getAccountId() != null) {
                    // Nếu có trùng accountId thì giữ bản đầu tiên
                    userByAccountId.putIfAbsent(u.getAccountId(), u);
                }
            }
        }

        // Map Account -> AccountDTO
        List<AccountDTO> content = new ArrayList<>();
        for (Account acc : accounts.getContent()) {
            if (acc == null) continue;

            AccountDTO dto = toDTO(acc);

            User u = userByAccountId.get(acc.getId());
            if (u != null) {
                dto.setFullName(u.getFullName());
                dto.setPhone(u.getPhone());
                dto.setBirthday(u.getBirthday());
                dto.setGender(u.getGender());
            }

            content.add(dto);
        }

        return new PageImpl<>(content, accounts.getPageable(), accounts.getTotalElements());
    }
}
