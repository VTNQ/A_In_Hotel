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

import static net.logstash.logback.argument.StructuredArguments.kv;

@Slf4j
@Component
public class ApiLoggingFilter extends OncePerRequestFilter {

    private static final ObjectMapper objectMapper = new ObjectMapper();
    private final PasswordEncoder passwordEncoder;
    public ApiLoggingFilter(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        String path = request.getRequestURI();

        // ✅ BYPASS swagger + static
        if (
                path.startsWith("/v3/api-docs") ||
                        path.startsWith("/swagger-ui") ||
                        path.equals("/swagger-ui.html") ||
                        path.startsWith("/actuator")
        ) {
            filterChain.doFilter(request, response);
            return;
        }

        ContentCachingRequestWrapper requestWrapper =
                new ContentCachingRequestWrapper(request);
        ContentCachingResponseWrapper responseWrapper =
                new ContentCachingResponseWrapper(response);

        long start = System.currentTimeMillis();
        filterChain.doFilter(requestWrapper, responseWrapper);
        long duration = System.currentTimeMillis() - start;

        Map<String, Object> logMap = new HashMap<>();
        logMap.put("method", request.getMethod());
        logMap.put("path", path);
        logMap.put("status", responseWrapper.getStatus());
        logMap.put("durationMs", duration);

        String requestBody = new String(
                requestWrapper.getContentAsByteArray(),
                StandardCharsets.UTF_8
        ).trim();

        if (!requestBody.isBlank() && requestBody.length() < 5_000) {
            logMap.put("requestBody", sanitizeBody(requestBody));
        }


        String responseBody = new String(
                responseWrapper.getContentAsByteArray(),
                StandardCharsets.UTF_8
        ).trim();

        if (!responseBody.isBlank() && responseBody.length() < 10_000) {
            try {
                logMap.put("responseBody", objectMapper.readTree(responseBody));
            } catch (Exception e) {
                logMap.put("responseBody", responseBody);
            }
        }

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null
                && auth.isAuthenticated()
                && !(auth instanceof AnonymousAuthenticationToken)
                && !"anonymousUser".equals(auth.getPrincipal())) {

            logMap.put("user", auth.getName());
        }

        log.info("[API]", kv("apiLog", logMap));
        responseWrapper.copyBodyToResponse();
    }

    private JsonNode sanitizeBody(String body) {
        try {
            JsonNode root = objectMapper.readTree(body);

            if (root.isObject()) {
                ObjectNode obj = (ObjectNode) root;
                if (obj.has("password")) {
                    String original = obj.get("password").asText();
                    if (original != null && !original.isBlank()) {
                        obj.put("password", passwordEncoder.encode(original));
                    }
                }
            }
            return root; // Trả về JsonNode thay vì String
        } catch (Exception e) {
            // fallback: nếu không phải JSON thì trả raw string
            return objectMapper.createObjectNode().put("raw", body);
        }
    }


}
