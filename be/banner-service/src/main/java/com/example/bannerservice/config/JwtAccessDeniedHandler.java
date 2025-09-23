package com.example.bannerservice.config;

import com.example.commonutils.api.RequestResponse;
import com.example.commonutils.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAccessDeniedHandler implements AccessDeniedHandler {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
        response.setContentType("application/json;charset=UTF-8");
        RequestResponse<Object> errorResponse =
                RequestResponse.error(ErrorCode.FORBIDDEN.getCode(), ErrorCode.FORBIDDEN.getDescription());
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
