package org.a_in_hotel.be.util;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.config.JwtService;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtils {
    private final JwtService jwtService;
    public Long getCurrentUserId(HttpServletRequest request) {
        String token = extractToken(request);
        if (token == null) {
            throw new RuntimeException("Token không hợp lệ hoặc không tồn tại!");
        }
        return jwtService.extractUserId(token);
    }
    private String extractToken(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }
        return authHeader.substring(7);
    }
}
