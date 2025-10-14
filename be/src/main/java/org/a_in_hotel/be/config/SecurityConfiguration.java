package org.a_in_hotel.be.config;

import org.a_in_hotel.be.service.AccountService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizationRequestRedirectFilter;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {
    private final JwtService jwtService;
    private final AccountService accountService;
    private final OAuth2UserService<OAuth2UserRequest, OAuth2User> oAuth2UserService;
    private final JwtFilter jwtFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;

    public SecurityConfiguration(
            @Lazy JwtService jwtService,
            @Lazy AccountService accountService,
            @Lazy JwtFilter jwtFilter,
            @Lazy OAuth2SuccessHandler oAuth2SuccessHandler,
            @Lazy OAuth2UserService<OAuth2UserRequest, OAuth2User> oauth2UserService
    ) {
        this.jwtService = jwtService;
        this.accountService = accountService;
        this.jwtFilter = jwtFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.oAuth2UserService = oauth2UserService;
    }
    @Bean
    public JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint() {
        return new JwtAuthenticationEntryPoint();
    }

    @Bean
    public JwtAccessDeniedHandler jwtAccessDeniedHandler() {
        return new JwtAccessDeniedHandler();
    }
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors->cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // các endpoint public
                        .requestMatchers(HttpMethod.POST, APIURL.URL_ANONYMOUS_POST).permitAll()
                        .requestMatchers(HttpMethod.GET, APIURL.URL_ANONYMOUS_GET).permitAll()

                        // chỉ SUPERADMIN mới được phép gọi
                        .requestMatchers(HttpMethod.GET, APIURL.URL_SUPERADMIN_GET).hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.POST, APIURL.URL_SUPERADMIN_POST).hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.POST,APIURL.URL_ADMIN_POST).hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT,APIURL.URL_ADMIN_PUT).hasRole("ADMIN")
                        // OAuth2 login chỉ cho đường dẫn oauth2/**
                        .requestMatchers("/oauth2/**").permitAll()

                        // tất cả các request khác cần xác thực
                        .anyRequest().permitAll()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint())
                        .accessDeniedHandler(jwtAccessDeniedHandler())
                )
                // OAuth2 config
                .oauth2Login(oauth -> oauth
                        .loginPage("/oauth2/authorization/google")
                        .userInfoEndpoint(userInfo -> userInfo.userService(oAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                )
                .authenticationProvider(authenticationProvider())
                // đặt JWT filter trước OAuth2LoginAuthenticationFilter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
                .addFilterBefore(jwtFilter, OAuth2AuthorizationRequestRedirectFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config
                .setAllowedOrigins(List.of(
                        "https://superadmin.ainhotelvn.com",
                        "http://localhost:5173"
                ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("Authorization"));
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authenticationProvider = new DaoAuthenticationProvider();
        authenticationProvider.setUserDetailsService(accountService); // Sử dụng service quản lý user
        authenticationProvider.setPasswordEncoder(passwordEncoder()); // Sử dụng mã hóa mật khẩu
        return authenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(); // Mã hóa mật khẩu bằng BCrypt
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager(); // Quản lý xác thực
    }
}
