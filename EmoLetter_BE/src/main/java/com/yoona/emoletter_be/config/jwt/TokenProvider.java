package com.yoona.emoletter_be.config.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.Date;

@RequiredArgsConstructor
@Service
public class TokenProvider {
    private final JwtProperties jwtProperties;

    //accessToken생성
    public String createAccessToken(String userId, String role){
        return createToken(userId, role, jwtProperties.getExpiration().getAccess());
    }
    //refreshToken생성
    public String createRefreshToken(String userId, String role){
        return createToken(userId, role, jwtProperties.getExpiration().getRefresh());
    }

    private String createToken(String userId, String role, long expirationMillis){
        return JWT.create()
                .withSubject(userId)
                .withIssuer(jwtProperties.getIssuer())
                .withClaim("role", role)
                .withExpiresAt(new Date(System.currentTimeMillis() + expirationMillis))
                .sign(Algorithm.HMAC256(jwtProperties.getSecretKey()));
    }

    //jwt 토큰 유효성 검사
    public boolean validateToken(String token){
        try{
            //토큰 파서를 빌드
            //JWT의 서명에 사용된 비밀키를 설정
            //이 비밀키로 토큰의 서명이 올바른지 검사
            Jwts.parser()
                    .setSigningKey(jwtProperties.getSecretKey().getBytes()) //비밀값으로 복호화
                    .parseClaimsJws(token);
            return true;
        } catch (Exception e){
            return false;
        }
    }



}
