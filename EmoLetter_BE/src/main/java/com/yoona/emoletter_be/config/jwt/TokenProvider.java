package com.yoona.emoletter_be.config.jwt;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User; // Spring Security User 클래스
import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.stream.Collectors;

import io.jsonwebtoken.Claims;


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
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationMillis);

        return Jwts.builder()
                .setSubject(userId) // 토큰의 subject (유저 ID)
                .setIssuer(jwtProperties.getIssuer())
                .claim("role", role) // 비공개 클레임
                .setIssuedAt(now)
                .setExpiration(expiration)
                .signWith(SignatureAlgorithm.HS256, jwtProperties.getSecretKey().getBytes())
                .compact();
    }

    // jwt 토큰 유효성 검사
    public boolean validateToken(String token){
        try{
            // getClaims 호출 시 예외가 발생하지 않으면 (서명/형식 모두 유효) true
            getClaims(token);
            return true;
        } catch (RuntimeException e){
            // getClaims 내부에서 던진 "유효하지 않은 토큰" 예외를 잡아 false 반환
            System.out.println("토큰 유효성 검사 실패: " + e.getMessage());
            return false;
        }
    }

    //토큰 기반으로 인증 정보를 가져오는 메서드
    public UsernamePasswordAuthenticationToken getAuthentication(String token){
        // 토큰에서 클레임 추출 - 'Claims'는 토큰에 담긴 정보들을 key-value 형태로 저장한 지도(Map)와 같음
        Claims claims = getClaims(token);

        //클레임에서 권한 정보 가져오기
        //"role"에 해당하는 값을 가져옴
        // - 그리고 이 권한 정보를 Spring Security가 이해할 수 있는 형식인 'GrantedAuthority' 객체로 바꿔줍니다.
        Collection<? extends GrantedAuthority> authorities =
                Arrays.stream(claims.get("role").toString().split(","))
                        .map(SimpleGrantedAuthority::new)
                        .collect(Collectors.toList());

        //UserDetails 객체 생성
        // 토큰에서 가져온 사용자 아이디(claims.getSubject())와
        // 위에서 만든 권한(authorities) 정보를 넣어서 'UserDetails' 객체를 만듭니다
        UserDetails principal = new User(claims.getSubject(), "", authorities);  //Spring Security의 User클래스임

        // Authentication 객체 반환
        // 'Authentication'은 사용자가 **인증을 완료했다**는 것을 나타내는 객체입니다.
        // 'UsernamePasswordAuthenticationToken'은 'Authentication'의 한 종류로,
        // 위에서 만든 'principal' 정보와 권한을 담아서 최종적인 인증 객체를 반환합니다.
        return new UsernamePasswordAuthenticationToken(principal, "", authorities);
    }

    //토큰 기반으로 유저 ID를 가져오는 메서드
    // validateToken()을 호출하면 검증을 다시 하는 비효율이 발생하므로, getClaims()를 사용합니다.
    public String getUserId(String token){
        // Jwts.parser()는 Subject를 유저 ID로 사용합니다.
        return getClaims(token).getSubject();
    }

    //토큰 기반으로 유저 역할을 가져오는 메서드
    public String getRole(String token){
        // 클레임에서 "role" 키에 해당하는 값을 가져옵니다.
        // 역할은 String 타입으로 반환됩니다.
        return getClaims(token).get("role", String.class);
    }

    // 토큰에서 클레임을 파싱하고 서명을 검증하는 보조 함수
    private Claims getClaims(String token){
        try{
            // Jwts.parser()를 사용하여 토큰을 파싱하고 서명을 검증합니다.
            // 유효하지 않거나 서명이 다르면 여기서 예외가 발생합니다.
            return Jwts.parser()
                    .setSigningKey(jwtProperties.getSecretKey().getBytes())
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e){
            // 만료된 토큰이 들어오면, 클레임을 반환하지 않고
            // 유효하지 않다는 RuntimeException을 던져서 요청을 거부합니다.
            throw new RuntimeException("만료된 토큰입니다. (Expired)", e);
        } catch (Exception e) {
            // 그 외 모든 유효하지 않은 토큰은 여기서 RuntimeException을 발생시킵니다.
            // (SecurityException, MalformedJwtException 등)
            throw new RuntimeException("유효하지 않은 토큰입니다.", e);
        }
    }

    //Refresh Token은 만료되어도 사용자 ID를 추출해야 하므로
    public String getUserIdFromExpiredToken(String token){
        // Jwts.parser()는 Subject를 유저 ID로 사용합니다.
        return getExpiredClaims(token).getSubject();
    }

    // Refresh Token 전용: 만료 여부와 관계없이 토큰의 클레임(정보)만 가져오는 함수
    public Claims getExpiredClaims(String token) {
        try {
            // Access Token처럼 유효성을 검증하는 파싱을 시도합니다.
            return Jwts.parser()
                    .setSigningKey(jwtProperties.getSecretKey().getBytes())
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            // [핵심 처리] Refresh Token은 만료되어도 안에 있는 정보가 필요합니다.
            // ExpiredJwtException이 발생하면, 토큰은 만료되었지만 클레임(사용자 정보)은 반환합니다.
            return e.getClaims();
        } catch (Exception e) {
            // 만료 외의 다른 오류 (서명 오류 등)는 여전히 유효하지 않으므로 예외를 던집니다.
            throw new RuntimeException("유효하지 않은 Refresh Token입니다.", e);
        }
    }

}
