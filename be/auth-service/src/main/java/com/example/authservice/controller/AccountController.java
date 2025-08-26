package com.example.authservice.controller;

import com.example.authservice.config.JwtService;
import com.example.authservice.dto.request.AccountDTO;
import com.example.authservice.dto.request.LoginDTO;
import com.example.authservice.dto.response.AccountResponse;
import com.example.authservice.dto.response.TokenResponse;
import com.example.authservice.entity.Account;
import com.example.authservice.mapper.AccountMapper;
import com.example.authservice.service.AccountService;
import com.example.commonutils.api.PageResponse;
import com.example.commonutils.api.RequestResponse;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
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
    public ResponseEntity<RequestResponse<Void>> create(@RequestBody AccountDTO accountDTO) {
       accountService.save(accountDTO);
        return ResponseEntity.ok(RequestResponse.success("Đăng ký tài khoản thành công"));
    }
    @GetMapping("/role")
    public ResponseEntity<RequestResponse<String>> getUserRole(@RequestParam("email") String email) {
        try {
            Account account = accountService.findByEmail(email);
            if (account == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(RequestResponse.error("User not found"));
            }
            return ResponseEntity.ok(RequestResponse.success(account.getRole().getName()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("An error occurred: " + e.getMessage()));
        }
    }
    @GetMapping("/me")
    public ResponseEntity<?>getMyInfo(@RequestHeader("Authorization")String authHeader) {
        try {
            Account account=accountService.getAccountFromToken(authHeader);
            AccountResponse accountDTO= accountMapper.toResponse(account);
            return ResponseEntity.ok(RequestResponse.success(accountDTO,"lấy account Theo token thành công"));

        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("An error occurred: " + e.getMessage()));
        }
    }
    @PostMapping("/refresh")
    public ResponseEntity<RequestResponse<Map<String,Object>>>refreshToken(@RequestBody Map<String, String> map) {
        String refreshToken=map.get("refreshToken");
        if(refreshToken==null){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("Refresh Token is required"));
        }
        try {
            if(jwtService.isTokenExpired(refreshToken)){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(RequestResponse.error("Refresh Token is expired"));
            }
            String email= jwtService.extractEmail(refreshToken);
            Long userId= jwtService.extractUserId(refreshToken);
            String role= jwtService.extractRole(refreshToken);
            String newAccessToken= jwtService.generateAccessToken(email,userId,role);
            long accessTokenExpiryAt=jwtService.getAccessTokenExpiryAt();

            Map<String,Object>response=new HashMap<>();
            response.put("accessToken",newAccessToken);
            response.put("accessTokenExpiryAt",accessTokenExpiryAt);
            return ResponseEntity.ok(RequestResponse.success(response));
        }catch (JwtException e){
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RequestResponse.error("Invalid refresh token: " + e.getMessage()));
        }
    }
    @GetMapping("/getAll")
    public ResponseEntity<RequestResponse<PageResponse<AccountDTO>>>getAll(@RequestParam(defaultValue = "1") int page,
                                                               @RequestParam(defaultValue = "5") int size,
                                                               @RequestParam(defaultValue = "id,desc") String sort,
                                                               @RequestParam(required = false) String filter,
                                                               @RequestParam(required = false) String search,
                                                               @RequestParam(defaultValue = "false") boolean all){
        try {
            return ResponseEntity.ok(
                    RequestResponse.success(
                            new PageResponse<>(accountService.findAll(page, size, sort, filter, search, all))
                    )
            );
        }catch (Exception e){
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("An error occurred: " + e.getMessage()));
        }
    }
    @GetMapping("/is-Superadmin")
    public ResponseEntity<RequestResponse<Map<String,Object>>>isAdmin(Long userId){
        try {
            Account account=accountService.findById(userId);
            if(account==null){
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(RequestResponse.error("User not found"));
            }
            boolean isAdmin = "SUPERADMIN".equalsIgnoreCase(account.getRole().getName());

            Map<String, Object> response = new HashMap<>();
            response.put("userId", userId);
            response.put("isAdmin", isAdmin);

            return ResponseEntity.ok(RequestResponse.success(response, "Check role success"));
        }catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("An error occurred: " + e.getMessage()));
        }
    }
    @PostMapping("/login")
    public ResponseEntity<RequestResponse<TokenResponse>> login(@RequestBody LoginDTO loginDTO) {
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
                long accessTokenExpiryAt=jwtService.getAccessTokenExpiryAt();
                long refreshTokenExpiryAt=jwtService.getRefreshTokenExpiryAt();
                String role=jwtService.extractRole(accessToken);
                return ResponseEntity.ok(RequestResponse.success(
                        new TokenResponse(refreshToken,accessToken,accessTokenExpiryAt,refreshTokenExpiryAt,role)
                ));
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(RequestResponse.error("Invalid username or password"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("An error occurred: " + e.getMessage()));
        }

    }

    @GetMapping("/admins")
    public ResponseEntity<List<AccountResponse>> getAllAdmins() {
        List<AccountResponse> admins = accountService.getAllAdmins();
        return ResponseEntity.ok(admins);
    }

    // Xoá ADMIN theo id
    @DeleteMapping("/admins/{id}")
    public ResponseEntity<RequestResponse<Void>> deleteAdmin(@PathVariable Long id) {
        try {
            accountService.deleteAdmin(id);
            return ResponseEntity.ok(RequestResponse.success("Xoá admin thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("Không thể xoá admin: " + e.getMessage()));
        }
    }

    // Sửa ADMIN
    @PutMapping("/admins/{id}")
    public ResponseEntity<RequestResponse<AccountResponse>> updateAdmin(
            @PathVariable Long id,
            @RequestBody AccountDTO accountDTO) {
        try {
            AccountResponse updated = accountService.updateAdmin(id, accountDTO);
            return ResponseEntity.ok(RequestResponse.success(updated, "Cập nhật admin thành công"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("Không thể cập nhật admin: " + e.getMessage()));
        }
    }
}
