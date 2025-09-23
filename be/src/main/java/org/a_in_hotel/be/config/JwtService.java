package org.a_in_hotel.be.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;

@Component
public class JwtService {
    @Value("${jwt.secret}")
    private String secret;
    @Value("${jwt.access-expiration}")
    private Long accessExpiration;
    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;
    private Key getSignKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(String email, Long userId,String role) {
        return buildToken(email, userId,role, accessExpiration);
    }

    public String generateRefreshToken(String email, Long userId,String role) {
        return buildToken(email, userId,role, refreshExpiration);
    }
    private String buildToken(String email, Long userId,String role, Long expiration) {
        return Jwts.builder()
                .setSubject(email)
                .claim("id", userId)
                .claim("role", role)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
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
    public Long getAccessTokenExpiryAt() {
        return System.currentTimeMillis() + accessExpiration;
    }
    public Long getRefreshTokenExpiryAt() {
        return System.currentTimeMillis() + refreshExpiration;
    }
    // ================== VALIDATE ===================
    public boolean validateToken(String token, UserDetails userDetails) {
        final String email=extractEmail(token);
        return email.equals(userDetails.getUsername()) && !isTokenExpired(token);
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
