package com.catcat.boot.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT 工具类
 */
@Slf4j
public class JwtUtil {

    /**
     * JWT 密钥（Base64编码）
     */
    private static final String SECRET_KEY = "catcat-secret-key-for-jwt-token-generation-2024";

    /**
     * JWT 签发者
     */
    private static final String ISSUER = "catcat";

    /**
     * 过期时间（24小时）
     */
    private static final long EXPIRATION_TIME = 24 * 60 * 60 * 1000L;

    /**
     * 生成JWT Token
     */
    public static String generateToken(Long userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("username", username);

        Date now = new Date();
        Date expiration = new Date(now.getTime() + EXPIRATION_TIME);

        SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));

        return Jwts.builder()
                .claims(claims)
                .subject(username)
                .issuer(ISSUER)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(key)
                .compact();
    }

    /**
     * 解析JWT Token
     */
    public static Claims parseToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(SECRET_KEY.getBytes(StandardCharsets.UTF_8));
            return Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();
        } catch (Exception e) {
            log.error("解析JWT Token失败: {}", e.getMessage());
            return null;
        }
    }

    /**
     * 验证Token是否有效
     */
    public static boolean validateToken(String token) {
        try {
            Claims claims = parseToken(token);
            if (claims == null) {
                return false;
            }
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            log.error("验证JWT Token失败: {}", e.getMessage());
            return false;
        }
    }

    /**
     * 从Token获取用户ID
     */
    public static Long getUserIdFromToken(String token) {
        Claims claims = parseToken(token);
        if (claims == null) {
            return null;
        }
        Object userId = claims.get("userId");
        if (userId instanceof Number) {
            return ((Number) userId).longValue();
        }
        return null;
    }

    /**
     * 从Token获取用户名
     */
    public static String getUsernameFromToken(String token) {
        Claims claims = parseToken(token);
        if (claims == null) {
            return null;
        }
        return claims.getSubject();
    }
}
