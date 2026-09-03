package com.yoona.emoletter_be.controller;

import com.yoona.emoletter_be.dto.token.TokenRequest;
import com.yoona.emoletter_be.dto.token.TokenResponse;
import com.yoona.emoletter_be.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class TokenApiController {
    private final TokenService tokenService;

    /**
     * AccessToken 재발급.
     *
     * refreshToken은 로그인 시 httpOnly 쿠키로 내려가기 때문에 브라우저의 자바스크립트가 읽을 수 없다.
     * 그래서 요청 본문만 받던 기존 방식으로는 프런트에서 재발급을 호출할 방법이 없었다.
     * 이제 쿠키를 먼저 보고, 없을 때만 본문 값을 사용한다.
     * (본문 방식은 모바일 등 쿠키를 쓰지 않는 클라이언트를 위해 남겨둔다.)
     */
    @PostMapping("/api/token")
    public ResponseEntity<TokenResponse> createToken(
            @CookieValue(value = "refreshToken", required = false) String cookieRefreshToken,
            @RequestBody(required = false) TokenRequest request) {

        String refreshToken = hasText(cookieRefreshToken)
                ? cookieRefreshToken
                : (request != null ? request.getRefreshToken() : null);

        if (!hasText(refreshToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String newAccessToken = tokenService.createNewAccessToken(refreshToken);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TokenResponse(newAccessToken));
    }

    private boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}
