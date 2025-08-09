package com.example.authservice.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtService {
    private final String JWT_KEY = "HarlestXakasjdhh12sadadwqdasdeascfasddacxajkasdjndhwnas";
    private final long MINUTE_EXPIRATION = 60;
    private final long JWT_EXPIRATION = 1000 * 60 * MINUTE_EXPIRATION;

    private static final long REFRESH_TOKEN_VALIDITY = 1000000000;
    public String generateToken(String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", "ROLE_" + role);
        claims.put("refresh_time",new Date(System.currentTimeMillis() + REFRESH_TOKEN_VALIDITY));

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(username)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + JWT_EXPIRATION))
                .signWith(getSignKey(), SignatureAlgorithm.HS256)
                .compact();
    }


    private Key getSignKey() {
        byte[] keyBytes = Decoders.BASE64.decode(JWT_KEY);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String refreshToken(String oldToken) {
        try {
            Jws<Claims> claimsJws = Jwts.parser()
                    .setSigningKey(JWT_KEY)
                    .build()
                    .parseClaimsJws(oldToken);

            Claims claims = claimsJws.getBody();

            if (claims.get("refresh_time", Date.class).before(new Date())) {
                throw new ExpiredJwtException(null, claims, "vui lòng đăng nhập lại");
            }

            String role = claims.get("role", String.class).substring(5);

            String newToken = generateToken(claims.getSubject(), role);
            return newToken;
        } catch (JwtException e) {
            throw new RuntimeException("Token không hợp lệ: " + e.getMessage());
        }
    }

    public Date extractExpiration(String token) {
        return extractAllClaims(token).getExpiration();
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .setSigningKey(getSignKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}
