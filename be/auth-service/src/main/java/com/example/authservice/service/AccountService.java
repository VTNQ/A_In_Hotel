package com.example.authservice.service;

import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.entity.Account;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface AccountService extends UserDetailsService {
    Account save(AccountDTO account);
}
