package org.a_in_hotel.be.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.a_in_hotel.be.dto.response.RequestResponse;
import org.a_in_hotel.be.exception.ErrorCode;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper=new ObjectMapper();
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        RequestResponse<Object> errorResponse=
                RequestResponse.error(ErrorCode.UNAUTHORIZED.getCode(),ErrorCode.UNAUTHORIZED.getDescription());
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
