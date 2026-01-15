package org.a_in_hotel.be.config;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.entity.Account;
import org.a_in_hotel.be.entity.Customer;
import org.a_in_hotel.be.entity.Role;
import org.a_in_hotel.be.repository.AccountRepository;
import org.a_in_hotel.be.repository.CustomerRepository;
import org.a_in_hotel.be.repository.RoleRepository;
import org.a_in_hotel.be.util.GeneralService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.Arrays;

@Component
@RequiredArgsConstructor
public class OAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final JwtService jwtService;
    private final AccountRepository accountRepository;
    private final GeneralService generalService;
    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;

    @Value("${app.oauth2.redirect-uri}")
    private String redirectUri;
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User principal = (OAuth2User) authentication.getPrincipal();
        String provider = ((org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken) authentication)
                .getAuthorizedClientRegistrationId()
                .toUpperCase(); // GOOGLE | FACEBOOK

        String email = principal.getAttribute("email");
        if (email == null) {
            email = principal.getAttribute("id") + "@facebook.com";
        }
        String fullName =principal.getAttribute("name");
        final String finalEmail = email;
        Account account = accountRepository.findByEmail(email)
                .orElseGet(()->createNewGoogleUser(finalEmail,fullName));
        String accessToken = jwtService.generateAccessToken(
                account.getEmail(),
                account.getId(),
                account.getRole().getName(),
                null
        );
        String refreshToken = jwtService.generateRefreshToken(
                account.getEmail(),
                account.getId(),
                account.getRole().getName(),
                null
        );
        long accessTokenExpiryAt = jwtService.getAccessTokenExpiryAt();
        long refreshTokenExpiryAt = jwtService.getRefreshTokenExpiryAt();
        String targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
                .queryParam("accessToken", accessToken)
                .queryParam("refreshToken", refreshToken)
                .queryParam("accessTokenExpiryAt",accessTokenExpiryAt)
                .queryParam("refreshTokenExpiryAt",refreshTokenExpiryAt)
                .build()
                .toUriString();
        getRedirectStrategy().sendRedirect(request,response,targetUrl);
    }
    private String[] parseFullName(String fullName) {
        if (fullName == null || fullName.trim().isEmpty()) {
            return new String[]{"", ""};
        }

        String[] parts = fullName.trim().split("\\s+");

        String firstName = parts[0];
        String lastName = parts.length > 1
                ? String.join(" ", Arrays.copyOfRange(parts, 1, parts.length))
                : "";

        return new String[]{firstName, lastName};
    }

    private Account createNewGoogleUser(String email,String fullName){
        String password = generalService.generateRandomPassword(8);
        Account account = new Account();
        account.setEmail(email);
        Role role = roleRepository.findById(6L)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        account.setRole(role);

        account.setPassword(passwordEncoder.encode(password));
        accountRepository.save(account);
        String[] nameParts = parseFullName(fullName);
        String firstName = nameParts[0];
        String lastName = nameParts[1];

        Customer customer = new Customer();
        customer.setFirstName(firstName);
        customer.setLastName(lastName);
        customer.setAccount(account);

        customerRepository.save(customer);
        return account;
    }
}
