package com.yoona.emoletter_be.service;

import com.auth0.jwt.interfaces.DecodedJWT;
import com.yoona.emoletter_be.config.jwt.JwtValidationException;
import com.yoona.emoletter_be.config.jwt.TokenProvider;
import com.yoona.emoletter_be.entity.RefreshToken;
import com.yoona.emoletter_be.entity.User;
import com.yoona.emoletter_be.repository.RefreshTokenRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.Optional;

@RequiredArgsConstructor
@Service
public class TokenService {
    private final TokenProvider tokenProvider;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserService userService;

    //사전에 필요 함수 --------------------------------------------
    //refreshToken으로 refreshToken 객체 검색
    public RefreshToken findByRefreshToken(String refreshToken) {
        return refreshTokenRepository.findByRefreshToken(refreshToken)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected token"));
    }

    //공통 함수 --------------------------------------------------
    //Token에서 Users
    public String findUsersIdByToken(String token) {
        String userId = tokenProvider.getUserId(token);
        User user = userService.findById(userId);
        return user.getUserId();
    }

    //Token에서 UserId 추출
    public String findUserIdByToken(String token) {
        return tokenProvider.getUserId(token);
    }

    //Token에서 Role 추출
    public String findRoleByToken(String token) {
        return tokenProvider.getRole(token);
    }

    //accessToken -----------------------------------------------

    //초기 accessToken 발급
    public String createAccessToken(String refreshToken, String role) {
        //토큰 유효성 검사에 실패하면 예외
        if(!tokenProvider.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String userId = findUsersIdByToken(refreshToken);
        if (userId == null) {
            throw new IllegalArgumentException("Can't get userId from refresh token");
        }

        return tokenProvider.createAccessToken(userId, role);
    }

    /// AccessToken 유효 시간 만료됐을 경우 RefreshToken 유효검사 후 재발급
    public String createNewAccessToken(String refreshToken) {
        // Refresh Token의 만료 여부와 관계없이 클레임(userId)을 가져옴 (서명 검증은 포함)
        String userId = tokenProvider.getUserIdFromExpiredToken(refreshToken); // [새로운 함수 필요]

        // 1. Redis에 해당 userId로 저장된 Refresh Token이 있는지 확인
        RefreshToken storedToken = refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new JwtValidationException("저장된 Refresh Token이 없습니다.", HttpStatus.UNAUTHORIZED));

        // 2. 전달된 Refresh Token과 Redis에 저장된 Token이 일치하는지 확인
        if (!storedToken.getRefreshToken().equals(refreshToken)) {
            throw new JwtValidationException("제공된 Refresh Token이 저장된 값과 일치하지 않습니다.", HttpStatus.UNAUTHORIZED);
        }

        // 3. User 정보를 가져와 새로운 Access Token 발급
        User user = userService.findById(userId);

        // **Access Token 발급**
        return tokenProvider.createAccessToken(user.getUserId(), user.getRole());
    }

    //refreshToken -----------------------------------------------
    //RefreshToken 발급
    @Transactional
    public String createRefreshToken(String userId, String role) {
        String refreshToken = tokenProvider.createRefreshToken(userId, role);
        refreshTokenRepository.save(new RefreshToken(userId, refreshToken));
        return refreshToken;
    }
    //RefreshToken 조회
    public RefreshToken findRefreshTokenByUserId(String userId) {
        return refreshTokenRepository.findByUserId(userId)
                .orElseThrow(() -> new IllegalArgumentException("not founded refreshToken by userId"));
    }
    //RefreshToken 삭제
    @Transactional
    public void deleteRefreshToken(String refreshToken) {
        // 1. Refresh Token에서 userId 추출 (만료되어도 클레임을 가져와야 함)
        String userId = tokenProvider.getUserIdFromExpiredToken(refreshToken);

        // 2. Redis에서 해당 userId의 토큰 삭제
        refreshTokenRepository.deleteById(userId);
    }
}
