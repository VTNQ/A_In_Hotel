package phucnghia.blog_service.config;

import com.example.commonutils.api.RequestResponse;
import com.example.commonutils.exception.ErrorCode;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {
    private final ObjectMapper objectMapper=new ObjectMapper();
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        RequestResponse<Object>errorResponse=
                RequestResponse.error(ErrorCode.UNAUTHORIZED.getCode(),ErrorCode.UNAUTHORIZED.getDescription());
        response.getWriter().write(objectMapper.writeValueAsString(errorResponse));
    }
}
