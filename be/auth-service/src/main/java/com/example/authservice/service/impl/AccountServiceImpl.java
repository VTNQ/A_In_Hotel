package com.example.authservice.service.impl;

import com.example.authservice.client.UserServiceClient;
import com.example.authservice.config.JwtService;
import com.example.authservice.dto.RequestResponse;
import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.dto.request.UserRequest;
import com.example.authservice.dto.response.PageResponse;
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
import io.github.perplexhub.rsql.RSQLJPASupport;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
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
import java.util.function.Function;
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
                              RoleRepository roleRepository, JwtService jwtService,UserServiceClient userServiceClient,
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
            UserRequest userRequest=new UserRequest();
            userRequest.setAccountId(account1.getId());
            userRequest.setBirthday(account.getBirthday());
            userRequest.setGender(account.getGender());
            userRequest.setAvatarUrl(account.getAvatarUrl()!=null?account.getAvatarUrl():"");
            userRequest.setPhone(account.getPhone());
            userRequest.setFullName(account.getFullName());
            userServiceClient.register(userRequest);
            log.info("Account saved successfully for user with id: {}", account1.getId());
        } catch (DataIntegrityViolationException e) {
            throw new DuplicateEmailException("Email đã tồn tại:" + account.getEmail());

        }catch (Exception e){
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
            page = Math.max(page, 1);
            size = Math.min(Math.max(size, 1), 200);

            Specification<Account> spec = Specification.where(null);
            if (filter != null && !filter.isBlank()) {
                spec = spec.and(RSQLJPASupport.<Account>toSpecification(filter));
            }
            if (search != null && !search.isBlank()) {
                spec = spec.and(RSQLJPASupport.<Account>toSpecification(search));
            }

            Pageable pageable = all
                    ? Pageable.unpaged()
                    : PageRequest.of(page - 1, size, SortHelper.parseSort(sort));

            Page<Account> accountPage = accountRepository.findAll(spec, pageable);

            // Gọi user-service
            RequestResponse<PageResponse<User>> resp =
                    userServiceClient.getAll(page, size, sort, filter, search, all);

            if (resp == null || resp.getData() == null || resp.getData().getContent() == null) {
                throw new IllegalStateException("user-service trả về rỗng");
            }

            Map<Long, User> userById = resp.getData().getContent().stream()
                    .filter(Objects::nonNull)
                    .collect(Collectors.toMap(User::getId, Function.identity(), (a, b) -> a));

            // ✨ Gọi mapper đã gói sẵn
            Page<AccountDTO> accountDTOS = accountMapper.toResponse(accountPage, userById);
            return accountDTOS;

            // TODO: return accountDTOS hoặc wrap vào Response tuỳ controller
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
        String token = jwtService.generateAccessToken(account.getEmail(),account.getId(),account.getRole().getName());

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

}
