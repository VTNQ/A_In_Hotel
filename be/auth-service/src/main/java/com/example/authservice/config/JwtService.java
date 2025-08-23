package com.example.authservice.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtService {
    private String jwtSecret="a-string-secret-at-least-256-bits-long";


    private long accessTokenExpiration=900000;


    private long refreshTokenExpiration=604800000;

    private Key getSignKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateAccessToken(String email, Long userId,String role) {
        return buildToken(email, userId,role, accessTokenExpiration);
    }

    public String generateRefreshToken(String email, Long userId,String role) {
        return buildToken(email, userId,role, refreshTokenExpiration);
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
    // ================== EXTRACT ===================
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
        return System.currentTimeMillis() + accessTokenExpiration;
    }
    public Long getRefreshTokenExpiryAt() {
        return System.currentTimeMillis() + refreshTokenExpiration;
    }
    // ================== VALIDATE ===================
    public boolean validateToken(String token,UserDetails userDetails) {
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
