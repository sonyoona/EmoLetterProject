package com.yoona.emoletter_be.controller;

import com.yoona.emoletter_be.dto.token.TokenRequest;
import com.yoona.emoletter_be.dto.token.TokenResponse;
import com.yoona.emoletter_be.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
public class TokenApiController {
    private final TokenService tokenService;

    @PostMapping("/api/token")
    public ResponseEntity<TokenResponse> createToken(@RequestBody TokenRequest request) {
        String newAccessToken = tokenService.createNewAccessToken(request.getRefreshToken());

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new TokenResponse(newAccessToken));

    }

}
