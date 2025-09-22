package com.example.userservice.config;

import com.example.commonutils.api.APIURL;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final JwtService jwtService;

    public SecurityConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Bean
    public JwtAuthorizationFilter jwtAuthorizationFilter() {
        return new JwtAuthorizationFilter(jwtService);
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
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
//                        .requestMatchers(HttpMethod.POST, APIURL.URL_ANONYMOUS_POST).permitAll()
//                        .requestMatchers(HttpMethod.PUT, APIURL.URL_ANONYMOUS_PUT).permitAll()
//                        .requestMatchers(HttpMethod.DELETE, APIURL.URL_ANONYMOUS_DELETE).permitAll()
                        .requestMatchers(HttpMethod.POST, APIURL.URL_SUPERADMIN_POST).hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.PUT, APIURL.URL_SUPERADMIN_PUT).hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.DELETE, APIURL.URL_SUPERADMIN_DELETE).hasRole("SUPERADMIN")
                        .requestMatchers(HttpMethod.GET, APIURL.URL_SUPERADMIN_GET).hasRole("SUPERADMIN")
//                        .requestMatchers(HttpMethod.POST, APIURL.URL_ADMIN_POST).hasRole("ADMIN")
//                        .requestMatchers(HttpMethod.PUT, APIURL.URL_ADMIN_PUT).hasRole("ADMIN")
//                        .requestMatchers(HttpMethod.DELETE, APIURL.URL_ADMIN_DELETE).hasRole("ADMIN")
//                        .requestMatchers(HttpMethod.GET, APIURL.URL_ADMIN_GET).hasRole("ADMIN")
                                .anyRequest().permitAll()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jwtAuthenticationEntryPoint())
                        .accessDeniedHandler(jwtAccessDeniedHandler())
                )
                .addFilterAfter(jwtAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}
