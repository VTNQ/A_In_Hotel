package org.a_in_hotel.be.controller;

import io.jsonwebtoken.JwtException;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.config.JwtService;
import org.a_in_hotel.be.dto.PageResponse;
import org.a_in_hotel.be.dto.request.*;
import org.a_in_hotel.be.dto.response.*;
import org.a_in_hotel.be.entity.Account;
import org.a_in_hotel.be.entity.Hotel;
import org.a_in_hotel.be.mapper.AccountMapper;
import org.a_in_hotel.be.service.AccountService;
import org.a_in_hotel.be.service.HotelService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor(onConstructor = @__(@Autowired))
@RequestMapping("/api/account")
@Tag(name = "account")
public class AccountController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private AccountService accountService;
    @Autowired
    private AccountMapper accountMapper;
    @Autowired
    private HotelService hotelService;
    @Autowired
    private JwtService jwtService;

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> create(@Valid @ModelAttribute AccountDTO accountDTO,
                                                        @RequestParam(value = "image", required = false) MultipartFile image) {
        accountService.save(accountDTO, image);
        return ResponseEntity.ok(RequestResponse.success("Đăng ký tài khoản thành công"));
    }

    @PostMapping(value = "/register/user")
    public ResponseEntity<RequestResponse<Void>> registerUser(@Valid @RequestBody UserDTO userDTO) {
        accountService.saveUser(userDTO);
        return ResponseEntity.ok(RequestResponse.success("Đăng ký tài khoản thành công"));
    }

    @GetMapping("/role")
    public ResponseEntity<RequestResponse<String>> getUserRole(@RequestParam("email") String email) {
        Account account = accountService.findByEmail(email);
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(RequestResponse.error("User not found"));
        }
        return ResponseEntity.ok(RequestResponse.success(account.getRole().getName()));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo(@RequestHeader("Authorization") String authHeader) {
        Account account = accountService.getAccountFromToken(authHeader);
        AccountResponse accountDTO = accountMapper.toResponse(account);
        return ResponseEntity.ok(RequestResponse.success(accountDTO, "lấy account Theo token thành công"));
    }

    @GetMapping("/user/profile")
    public ResponseEntity<RequestResponse<CustomerProfileResponse>> profileUser() {
        return ResponseEntity.ok(RequestResponse.success(
                accountService.getAccountUserProfile()));
    }

    @GetMapping("/getAll")
    public ResponseEntity<RequestResponse<PageResponse<AccountResponse>>> getAll(@RequestParam(defaultValue = "1") int page,
                                                                                 @RequestParam(defaultValue = "5") int size,
                                                                                 @RequestParam(defaultValue = "id,desc") String sort,
                                                                                 @RequestParam(required = false) String filter,
                                                                                 @RequestParam(required = false) String searchField,
                                                                                 @RequestParam(required = false) String searchValue,
                                                                                 @RequestParam(required = false) boolean all) {
        return ResponseEntity.ok(
                RequestResponse.success(
                        new PageResponse<>(accountService.findAll(page, size, sort, filter, searchField, searchValue, all))
                )
        );

    }

    @PostMapping("/refresh")
    public ResponseEntity<RequestResponse<Map<String, Object>>> refreshToken(@RequestBody Map<String, String> map) {
        String refreshToken = map.get("refreshToken");
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(RequestResponse.error("Refresh Token is required"));
        }
        if (jwtService.isTokenExpired(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RequestResponse.error("Refresh Token is expired"));
        }
        String email = jwtService.extractEmail(refreshToken);
        Long userId = jwtService.extractUserId(refreshToken);
        String role = jwtService.extractRole(refreshToken);
        Long hotelId = jwtService.extractHotelId(refreshToken);
        String newAccessToken = jwtService.generateAccessToken(email, userId, role, hotelId == null ? null : hotelId);
        long accessTokenExpiryAt = jwtService.getAccessTokenExpiryAt();

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", newAccessToken);
        response.put("accessTokenExpiryAt", accessTokenExpiryAt);
        return ResponseEntity.ok(RequestResponse.success(response));
    }

    @GetMapping("/me/profile")
    public ResponseEntity<RequestResponse<ProfileSystemResponse>> getMyProfile() {
        return ResponseEntity.ok(
                RequestResponse.success(accountService.getProfile())
        );

    }

    @PatchMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<RequestResponse<Void>> updateProfile(
            @ModelAttribute ProfileSystemRequest request,
            @RequestParam(value = "image", required = false) MultipartFile file
    ) {
        accountService.updateProfileSystem(request, file);
        return ResponseEntity.ok(RequestResponse.success("Cập nhật profile thành công"));
    }

    @PutMapping(value = "/me/password")
    public ResponseEntity<RequestResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        accountService.changePassword(request);
        return ResponseEntity.ok(
                RequestResponse.success("Password updated successfully")
        );
    }

    @PostMapping("/login")
    public ResponseEntity<RequestResponse<TokenResponse>> login(@RequestBody LoginDTO loginDTO) {

        // 1. Xác thực tài khoản
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(),
                        loginDTO.getPassword()
                )
        );

        if (!authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(RequestResponse.error("Invalid username or password"));
        }

        // 2. Lấy account sau khi login thành công
        Account account = (Account) authentication.getPrincipal();

        // 3. Lấy hotel (có thể null)
        Long hotelId = null;
        if (account.getRole().getId() == 2) {
            Hotel hotel = hotelService.getHotelByAccountId(account.getId());
            if (hotel != null) {
                hotelId = hotel.getId();
            }

        }else if(account.getRole().getId()==3){
            if(account.getStaff()!=null){
                hotelId = account.getStaff().getHotelId();
            }

        }

        // 4. Generate token
        String accessToken = jwtService.generateAccessToken(
                account.getEmail(),
                account.getId(),
                account.getRole().getName(),
                hotelId
        );

        String refreshToken = jwtService.generateRefreshToken(
                account.getEmail(),
                account.getId(),
                account.getRole().getName(),
                hotelId
        );

        // 5. Expiry time
        long accessTokenExpiryAt = jwtService.getAccessTokenExpiryAt();
        long refreshTokenExpiryAt = jwtService.getRefreshTokenExpiryAt();

        // 6. Role
        String role = jwtService.extractRole(accessToken);

        // 7. Trả response thành công
        TokenResponse tokenResponse = new TokenResponse(
                refreshToken,
                accessToken,
                accessTokenExpiryAt,
                refreshTokenExpiryAt,
                role,
                hotelId
        );

        return ResponseEntity.ok(RequestResponse.success(tokenResponse));


    }
}
