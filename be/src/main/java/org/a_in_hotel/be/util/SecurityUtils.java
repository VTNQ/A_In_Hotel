package org.a_in_hotel.be.util;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.a_in_hotel.be.config.JwtService;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@RequiredArgsConstructor
public class SecurityUtils {
    private final JwtService jwtService;
    public Long getCurrentUserId() {
        String token = extractToken();
        if (token == null) {
            throw new RuntimeException("Token không hợp lệ hoặc không tồn tại!");
        }
        return jwtService.extractUserId(token);
    }
    public Long getHotelId(){
        String token = extractToken();
        if (token == null) {
            throw new RuntimeException("Token không hợp lệ hoặc không tồn tại!");
        }
        return jwtService.extractHotelId(token);
    }
    /**
     * ✅ Lấy email (username) từ JWT token hiện tại
     */
    public String getCurrentUserEmail() {
        String token = extractToken();
        if (token == null) {
            throw new RuntimeException("Token không hợp lệ hoặc không tồn tại!");
        }
        return jwtService.extractEmail(token);
    }

    /**
     * ✅ Lấy role từ JWT token hiện tại
     */
    public String getCurrentUserRole() {
        String token = extractToken();
        if (token == null) {
            throw new RuntimeException("Token không hợp lệ hoặc không tồn tại!");
        }
        return jwtService.extractRole(token);
    }
    /**
     * ✅ Lấy token hiện tại từ header Authorization
     */
    private String extractToken() {
        RequestAttributes attributes = RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            return null;
        }

        HttpServletRequest request = ((ServletRequestAttributes) attributes).getRequest();
        if (request == null) {
            return null;
        }

        final String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        return authHeader.substring(7);
    }
}
