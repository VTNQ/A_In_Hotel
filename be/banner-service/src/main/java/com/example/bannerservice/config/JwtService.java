package com.example.bannerservice.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
@Component
public class JwtService {
    private String jwtSecret="a-string-secret-at-least-256-bits-long";


    private long accessTokenExpiration=900000;


    private long refreshTokenExpiration=604800000;

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }

    public Long extractUserId(String token) {
        return extractClaims(token).get("id", Long.class);
    }
    public String extractRole(String token) {
        return extractClaims(token).get("role", String.class);
    }
    public Date extractExpiration(String token) {
        return extractClaims(token).getExpiration();
    }
    public boolean validateToken(String token,String emailToken) {
        final String email=extractEmail(token);
        return email.equals(emailToken) && !isTokenExpired(token);
    }
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
