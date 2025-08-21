package com.example.authservice.controller;

import com.example.authservice.config.JwtService;
import com.example.authservice.dto.RequestResponse;
import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.dto.request.LoginDTO;
import com.example.authservice.dto.response.AccountResponse;
import com.example.authservice.dto.response.TokenResponse;
import com.example.authservice.entity.Account;
import com.example.authservice.exception.ExceptionResponse;
import com.example.authservice.mapper.AccountMapper;
import com.example.authservice.service.AccountService;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

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


    @PostMapping("/register")
    public ResponseEntity<?> create(@RequestBody AccountDTO accountDTO) {
       accountService.save(accountDTO);

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
    @PostMapping("/refresh")
    public ResponseEntity<?>refreshToken(@RequestBody Map<String, String> map) {
        String refreshToken=map.get("refreshToken");
        if(refreshToken==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new ExceptionResponse("Refresh Token is required"));
        }
        try {
            if(jwtService.isTokenExpired(refreshToken)){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new ExceptionResponse("Refresh Token is expired"));
            }
            String email= jwtService.extractEmail(refreshToken);
            Long userId= jwtService.extractUserId(refreshToken);
            String role= jwtService.extractRole(refreshToken);
            String newAccessToken= jwtService.generateAccessToken(email,userId,role);
            long exipiresInAcess=jwtService.getAccessTokenExpiration();
            Map<String,Object>response=new HashMap<>();
            response.put("accessToken",newAccessToken);
            response.put("expiresInAccessToken",exipiresInAcess);
            return ResponseEntity.ok(new RequestResponse(response));
        }catch (JwtException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new ExceptionResponse("Invalid refresh token: " + e.getMessage()));
        }
    }
    @GetMapping("/is-admin")
    public ResponseEntity<?>isAdmin(Long userId){
        try {
            Account account=accountService.findById(userId);
            if(account==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(new ExceptionResponse("User not found"));
            }
            boolean isAdmin = "ADMIN".equalsIgnoreCase(account.getRole().getName());

            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("isAdmin", isAdmin);

            return ResponseEntity.ok(new RequestResponse(response, "Check role success"));
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
                String accessToken= jwtService.generateAccessToken(account.getEmail(),account.getId(),account.getRole().getName());
                String refreshToken= jwtService.generateRefreshToken(account.getEmail(),account.getId(),account.getRole().getName());
                long expiresInAccess=jwtService.getAccessTokenExpiration();
                long expiresInRefreshToken=jwtService.getRefreshTokenExpiration();
                return ResponseEntity.ok(new RequestResponse(
                        new TokenResponse(refreshToken,accessToken,expiresInAccess,expiresInRefreshToken)
                ));
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
