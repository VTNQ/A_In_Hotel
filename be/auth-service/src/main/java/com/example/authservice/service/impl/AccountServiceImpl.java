package com.example.authservice.service.impl;

import com.example.authservice.config.JwtService;
import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.entity.Account;
import com.example.authservice.entity.Role;
import com.example.authservice.exception.ErrorHandler;
import com.example.authservice.exception.account.DuplicateEmailException;
import com.example.authservice.repository.AccountRepository;
import com.example.authservice.repository.RoleRepository;
import com.example.authservice.service.AccountService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.*;

@Slf4j
@Service
public class AccountServiceImpl implements AccountService, OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;

    // Constructor injection (Spring tự động inject)
    public AccountServiceImpl(AccountRepository accountRepository,
                              PasswordEncoder passwordEncoder,
                              RoleRepository roleRepository, JwtService jwtService) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
    }

    @Override
    @Transactional
    public Account save(AccountDTO account) {
        try {
            log.info("save account:{}", account);
            Role role = roleRepository.getReferenceById(account.getIdRole());
            Account account1 = Account
                    .builder()
                    .email(account.getEmail())
                    .password(passwordEncoder.encode(account.getPassword()))
                    .role(role)
                    .build();

            log.info("Account saved successfully for user with id: {}", account1.getId());
            return accountRepository.save(account1);
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateEmailException("Email đã tồn tại:" + account.getEmail());

        }
    }

    @Override
    public Account getAccountFromToken(String token) {
        try {
            if (token.startsWith("Bearer ")) {
                token = token.substring(7);
            }
            String username = jwtService.extractEmail(token);
            return accountRepository.findByEmail(username)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        } catch (Exception e) {
            throw new RuntimeException("Invalid token", e);
        }
    }

    @Override
    public Account findByEmail(String email) {
        return accountRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<Account> account = accountRepository.findByEmail(email);
        return account.orElseThrow(() -> new ErrorHandler(HttpStatus.UNAUTHORIZED, "Account not exist"));
    }
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = new DefaultOAuth2UserService().loadUser(userRequest);
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        if ("google".equals(registrationId)) {
            throw new OAuth2AuthenticationException("Unsupported provider:" + registrationId);
        }
        String email = (String) oAuth2User.getAttributes().get("email");
        Account account = accountRepository.findByEmail(email)
                .orElseGet(() -> {
                    Role userRole = roleRepository.findById(1L)
                            .orElseThrow(() -> new IllegalStateException("Role ROLE_USER not found"));
                    return Account.builder()
                            .email(email)
                            .password(null)
                            .role(userRole)
                            .build();
                });
        accountRepository.save(account);
        String roleName = account.getRole() != null ? account.getRole().getName() : "ROLE_USER";
        Collection<? extends GrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority(roleName));
        Map<String, Object> attrs = new HashMap<>();
        attrs.put("email", email);

        return new DefaultOAuth2User(
                authorities,
                attrs,
                "email"
        );

    }

}
