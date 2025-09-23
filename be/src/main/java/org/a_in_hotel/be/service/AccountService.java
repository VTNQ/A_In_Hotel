package org.a_in_hotel.be.service;

import org.a_in_hotel.be.dto.request.AccountDTO;
import org.a_in_hotel.be.dto.response.AccountResponse;
import org.a_in_hotel.be.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AccountService extends UserDetailsService {
    Account findByEmail(String email);
    void save(AccountDTO accountDTO);
    Account getAccountFromToken(String token);
    Page<AccountResponse> findAll(Integer page, Integer size, String sort, String filter, String searchField, String searchValue, boolean all);
    AccountResponse updateAdmin(Long id, AccountDTO accountDTO);
}
