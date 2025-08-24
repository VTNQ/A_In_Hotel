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
        @Mapping(target = "id", source = "id")
        @Mapping(target = "email", source = "email")
        AccountDTO toDTO(Account account);
        default AccountDTO toResponse(Account account, User user) {
            if (account == null) return null;
            AccountDTO dto = toDTO(account);
            if (user != null) {
                dto.setFullName(user.getFullName());      // đảm bảo AccountDTO có setter này
                dto.setPhone(user.getPhone());
                dto.setGender(user.getGender());
                dto.setBirthday(user.getBirthday());
            }
            return dto;
        }
        default List<AccountDTO> toResponse(List<Account> accounts, List<User> users) {
            if (accounts == null || accounts.isEmpty()) return List.of();

            Map<Long, User> userMap = (users == null) ? Map.of()
                    : users.stream()
                    .filter(Objects::nonNull)
                    .filter(u -> u.getAccountId() != null)
                    .collect(Collectors.toMap(
                            User::getAccountId,
                            Function.identity(),
                            (a, b) -> a // giữ bản đầu nếu trùng id
                    ));

            return accounts.stream()
                    .map(acc -> toResponse(acc, userMap.get(acc.getId())))
                    .toList();
        }
    }
