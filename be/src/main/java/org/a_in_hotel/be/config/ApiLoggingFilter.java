package org.a_in_hotel.be.config;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
@Slf4j
@Component
public class ApiLoggingFilter extends OncePerRequestFilter {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final PasswordEncoder passwordEncoder;
    public ApiLoggingFilter(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        ContentCachingRequestWrapper requestWrapper = new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);
        long start = System.currentTimeMillis();
        filterChain.doFilter(requestWrapper, responseWrapper);
        long duration = System.currentTimeMillis() - start;
        Map<String,Object> logMap = new HashMap<>();
        logMap.put("method", request.getMethod());
        logMap.put("url", request.getRequestURL());
        logMap.put("status", response.getStatus());
        logMap.put("durationMs", duration);
        String requestBody=new String(requestWrapper.getContentAsByteArray(), StandardCharsets.UTF_8).trim();
        if(!requestBody.isBlank()){
            logMap.put("requestBody", sanitizeBody(requestBody));
        }
        String responseBody = new String(responseWrapper.getContentAsByteArray(), StandardCharsets.UTF_8).trim();
        if (!responseBody.isBlank()) {
            logMap.put("responseBody", responseBody);
        }
        responseWrapper.copyBodyToResponse();

        // thông tin user (nếu đã xác thực)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null
                && authentication.isAuthenticated()
                && !(authentication instanceof AnonymousAuthenticationToken)
                && !"anonymousUser".equals(authentication.getPrincipal())) {

            logMap.put("user", authentication.getName());

            // token → mask 1 phần
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                String maskedToken = token.length() > 10
                        ? token.substring(0, 10) + "****"
                        : token;
                logMap.put("token", maskedToken);
            }
        }

        log.info("[API] {}", logMap);
    }
    private String sanitizeBody(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);

            if (root.isObject()) {
                ObjectNode obj = (ObjectNode) root;
                if (obj.has("password")) {
                    String original = obj.get("password").asText();

                    // Nếu có giá trị thì che lại
                    if (original != null && !original.isBlank()) {
                        obj.put("password", passwordEncoder.encode(original));
                    }
                }
            }

            return objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            // fallback: nếu không phải JSON thì regex mask
            return body.replaceAll(
                    "\"password\"\\s*:\\s*\"[^\"]*\"",
                    "\"password\":\"***\""
            );
        }
    }

}
