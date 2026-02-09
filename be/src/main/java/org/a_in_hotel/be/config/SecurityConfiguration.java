package org.a_in_hotel.be.config;

import org.a_in_hotel.be.service.AccountService;
import org.a_in_hotel.be.service.impl.CustomOAuth2UserService;
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
    private final AccountService accountService;

    private final JwtFilter jwtFilter;
    private final OAuth2SuccessHandler oAuth2SuccessHandler;
    private final CustomOAuth2UserService customOAuth2UserService;
    public SecurityConfiguration(
            @Lazy AccountService accountService,
            @Lazy JwtFilter jwtFilter,
            @Lazy OAuth2SuccessHandler oAuth2SuccessHandler,
            @Lazy CustomOAuth2UserService customOAuth2UserService
    ) {
        this.accountService = accountService;
        this.jwtFilter = jwtFilter;
        this.oAuth2SuccessHandler = oAuth2SuccessHandler;
        this.customOAuth2UserService = customOAuth2UserService;

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
                        .requestMatchers(HttpMethod.POST,APIURL.URL_SUPER_ADMIN_ADMIN_POST).hasAnyRole("ADMIN", "SUPERADMIN")
                        .requestMatchers(HttpMethod.PUT,APIURL.URL_SUPER_ADMIN_ADMIN_PUT).hasAnyRole("ADMIN", "SUPERADMIN")
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
                        .userInfoEndpoint(userInfo ->
                                userInfo.userService(customOAuth2UserService))
                        .successHandler(oAuth2SuccessHandler)
                )
                .authenticationProvider(authenticationProvider())
                // đặt JWT filter trước OAuth2LoginAuthenticationFilter

                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of(
                "http://localhost:8585",
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "https://superadmin.ainhotelvn.com",
                "https://admin.ainhotelvn.com",
                "https://www.ainhotelvn.com"
        ));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
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
