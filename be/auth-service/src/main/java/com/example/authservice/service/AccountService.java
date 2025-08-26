package com.example.authservice.service;

import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.dto.response.AccountResponse;
import com.example.authservice.entity.Account;
import org.springframework.data.domain.Page;
import org.springframework.security.core.userdetails.UserDetailsService;

import java.util.List;

public interface AccountService extends UserDetailsService {
    void save(AccountDTO account);
    Account getAccountFromToken(String token);
    Account findByEmail(String email);
    Account findById(Long id);
    Page<AccountDTO>findAll(int page, int size, String sort, String filter, String search, boolean all);
    List<AccountResponse> getAllAdmins();
    void deleteAdmin(Long id);
    AccountResponse updateAdmin(Long id, AccountDTO accountDTO);

}
