package com.example.authservice.service.impl;

import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.entity.Account;
import com.example.authservice.entity.Role;
import com.example.authservice.repository.AccountRepository;
import com.example.authservice.repository.RoleRepository;
import com.example.authservice.service.AccountService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    // Constructor injection (Spring tự động inject)
    public AccountServiceImpl(AccountRepository accountRepository,
                              PasswordEncoder passwordEncoder,
                              RoleRepository roleRepository) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    @Override
    public void save(AccountDTO account) {
        try {
            log.info("save account:{}", account);
            Role role = roleRepository.getReferenceById(account.getIdRole());
            Account account1 = Account
                    .builder()
                    .email(account.getEmail())
                    .password(passwordEncoder.encode(account.getPassword()))
                    .role(role)
                    .build();
            accountRepository.save(account1);
            log.info("Account saved successfully for user with id: {}", account1.getId());
        } catch (Exception e) {
            e.printStackTrace();

        }
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return null;
    }
}
