package com.example.authservice.controller;

import com.example.authservice.config.JwtService;
import com.example.authservice.dto.RequestResponse;
import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.dto.request.LoginDTO;
import com.example.authservice.dto.response.AccountResponse;
import com.example.authservice.dto.response.TokenResponse;
import com.example.authservice.entity.Account;
import com.example.authservice.exception.ExceptionResponse;
import com.example.authservice.kafka.event.UserRegisteredEvent;
import com.example.authservice.kafka.producer.UserEventProducer;
import com.example.authservice.mapper.AccountMapper;
import com.example.authservice.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
public class AccountController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private UserEventProducer userEventProducer;
    @Value("${app.kafka.topic.user-registered}")
    private String userRegisteredTopic;

    @PostMapping("/register")
    public ResponseEntity<?> create(@RequestBody AccountDTO accountDTO) {
       Account account= accountService.save(accountDTO);
        UserRegisteredEvent event = UserRegisteredEvent
                .builder()
                .accountId(account.getId())
                .fullName(null)
                .phone(null)
                .avatarUrl(null)
                .build();
        userEventProducer.publishUserRegistered(userRegisteredTopic, event);
        return ResponseEntity.ok(new RequestResponse("Đăng ký tài khoản thành công"));
    }
    @GetMapping("/role")
    public ResponseEntity<?> getUserRole(@RequestParam("email") String email) {
        try {
            Account account = accountService.findByEmail(email);
            if (account == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ExceptionResponse("User not found"));
            }
            return ResponseEntity.ok(account.getRole().getName());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?>getMyInfo(@RequestHeader("Authorization")String authHeader) {
        try {
            Account account=accountService.getAccountFromToken(authHeader);
            AccountResponse accountDTO= accountMapper.toResponse(account);
            return ResponseEntity.ok(new RequestResponse(accountDTO,"lấy account Theo token thành công"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginDTO.getUsername(),
                            loginDTO.getPassword()
                    )
            );
            if (authentication.isAuthenticated()) {
                Account account = (Account) authentication.getPrincipal();
                String token = jwtService.generateToken(account.getEmail());
                return ResponseEntity.ok(new TokenResponse(token));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ExceptionResponse("Invalid username or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("An error occurred: " + e.getMessage()));
        }

    }
}
