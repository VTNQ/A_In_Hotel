package com.example.authservice.service.impl;

import com.example.authservice.client.UserServiceClient;
import com.example.authservice.config.JwtService;
import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.dto.request.UserRequest;
import com.example.authservice.dto.response.AccountResponse;
import com.example.authservice.dto.response.User;
import com.example.authservice.entity.Account;
import com.example.authservice.entity.Role;
import com.example.authservice.exception.ErrorHandler;
import com.example.authservice.exception.account.DuplicateEmailException;
import com.example.authservice.mapper.AccountMapper;
import com.example.authservice.repository.AccountRepository;
import com.example.authservice.repository.RoleRepository;
import com.example.authservice.service.AccountService;
import com.example.authservice.util.SortHelper;

import com.example.commonutils.api.RequestResponse;
import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
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

import org.springframework.security.access.AccessDeniedException;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class AccountServiceImpl implements AccountService, OAuth2UserService<OAuth2UserRequest, OAuth2User> {
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final JwtService jwtService;
    private final UserServiceClient userServiceClient;
    private final AccountMapper accountMapper;

    // Constructor injection (Spring tự động inject)
    public AccountServiceImpl(AccountRepository accountRepository,
                              PasswordEncoder passwordEncoder,
                              RoleRepository roleRepository, JwtService jwtService, UserServiceClient userServiceClient,
                              AccountMapper accountMapper) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.jwtService = jwtService;
        this.userServiceClient = userServiceClient;
        this.accountMapper = accountMapper;
    }

    @Override
    @Transactional
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
            UserRequest userRequest = new UserRequest();
            userRequest.setAccountId(account1.getId());
            userRequest.setBirthday(account.getBirthday());
            userRequest.setGender(account.getGender());
            userRequest.setAvatarUrl(account.getAvatarUrl() != null ? account.getAvatarUrl() : "");
            userRequest.setPhone(account.getPhone());
            userRequest.setFullName(account.getFullName());
            userServiceClient.register(userRequest);
            log.info("Account saved successfully for user with id: {}", account1.getId());
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateEmailException("Email đã tồn tại:" + account.getEmail());

        } catch (Exception e) {
            e.printStackTrace();
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
    public Account findById(Long id) {
        return accountRepository.findById(id).orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
    }

    @Override
    public Page<AccountDTO> findAll(int page, int size, String sort, String filter, String search, boolean all) {
        try {
            List<Account> accounts = accountRepository.findAll();
            if (accounts.isEmpty()) {
                return Page.empty();
            }
            List<Long> userIds = accounts.stream()
                    .map(Account::getId)
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());
            RequestResponse<List<User>> response = userServiceClient.getAll(userIds);
            List<User> users = response != null && response.getData() != null ? response.getData() : List.of();
            List<AccountDTO> dtos = accountMapper.toResponse(accounts, users);
            Specification<AccountDTO> dtoSpec = Specification.where(null);
            if (filter != null && !filter.isEmpty()) {
                dtoSpec = dtoSpec.and(RSQLJPASupport.<AccountDTO>toSpecification(filter));
            }
            if (search != null && !search.isEmpty()) {
                dtoSpec = dtoSpec.and(RSQLJPASupport.<AccountDTO>toSpecification(search));
            }

            List<AccountDTO> filtered = dtos.stream()
                    .filter(dto -> filter == null || filter.isBlank() ||
                            (dto.getEmail() != null && dto.getEmail().contains(filter)) ||
                            (dto.getFullName() != null && dto.getFullName().contains(filter)))
                    .filter(dto -> search == null || search.isBlank() ||
                            (dto.getEmail() != null && dto.getEmail().toLowerCase().contains(search.toLowerCase())) ||
                            (dto.getFullName() != null && dto.getFullName().toLowerCase().contains(search.toLowerCase())))
                    .toList();
            Comparator<AccountDTO> comparator = SortHelper.parseSort(sort);
            if (comparator != null) {
                filtered = filtered.stream().sorted(comparator).toList();
            }
            int from = Math.max(0, (page - 1) * size);
            int to = all ? filtered.size() : Math.min(filtered.size(), from + size);
            List<AccountDTO> pageContent = from <= to ? filtered.subList(from, to) : filtered;
            return new PageImpl<>(pageContent, PageRequest.of(page - 1, size), filtered.size());

        } catch (Exception e) {
            log.error("error occurred while trying to find all accounts: {}", e.getMessage(), e);
            throw new RuntimeException("get list error:", e);
        }

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

        String email = null;

        if ("google".equals(registrationId)) {
            // Google trả về "email" trong attributes
            email = (String) oAuth2User.getAttributes().get("email");
        } else {
            throw new OAuth2AuthenticationException("Unsupported provider: " + registrationId);
        }

        if (email == null) {
            throw new OAuth2AuthenticationException("Email not found from provider: " + registrationId);
        }
        final String userEmail = email;
        Account account = accountRepository.findByEmail(email)
                .orElseGet(() -> {
                    Role userRole = roleRepository.findById(1L)
                            .orElseThrow(() -> new IllegalStateException("Role ROLE_USER not found"));
                    return accountRepository.save(Account.builder()
                            .email(userEmail)
                            .password(null)
                            .role(userRole)
                            .build());
                });

        // Tạo JWT token
        String token = jwtService.generateAccessToken(account.getEmail(), account.getId(), account.getRole().getName());

        Map<String, Object> attrs = new HashMap<>(oAuth2User.getAttributes());
        attrs.put("token", token);

        Collection<? extends GrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority("ROLE_" + account.getRole().getName()));

        return new DefaultOAuth2User(
                authorities,
                attrs,
                "email"
        );

    }

    @Override
    public List<AccountResponse> getAllAdmins() {
        List<Account> admins = accountRepository.findByRole_Name("ADMIN");
        return admins.stream()
                .map(accountMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public void deleteAdmin(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Admin không tồn tại"));
        if (!"ADMIN".equalsIgnoreCase(account.getRole().getName())) {
            throw new IllegalArgumentException("Không phải admin, không thể xoá");
        }
        accountRepository.delete(account);
    }

    @Override
    public AccountResponse updateAdmin(Long id, AccountDTO accountDTO) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new UsernameNotFoundException("Admin không tồn tại"));

        if (!"ADMIN".equalsIgnoreCase(account.getRole().getName())) {
            throw new IllegalArgumentException("Không phải admin, không thể sửa");
        }

        account.setEmail(accountDTO.getEmail() != null ? accountDTO.getEmail() : account.getEmail());
        account.setPassword(accountDTO.getPassword() != null ? passwordEncoder.encode(accountDTO.getPassword()) : account.getPassword());
        accountRepository.save(account);

        return accountMapper.toResponse(account);
    }



}
