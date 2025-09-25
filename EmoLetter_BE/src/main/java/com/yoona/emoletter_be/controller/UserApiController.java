package com.yoona.emoletter_be.controller;

import com.yoona.emoletter_be.dto.user.*;
import com.yoona.emoletter_be.entity.User;
import com.yoona.emoletter_be.repository.UserRepository;
import com.yoona.emoletter_be.service.TokenService;
import com.yoona.emoletter_be.service.UserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@RequiredArgsConstructor
@Controller
@RequestMapping("/api")
public class UserApiController {

    private final UserService userService;
    private final TokenService tokenService;

    //회원가입
    @PostMapping("/user")
    public ResponseEntity<Void> createUser(@Valid @RequestBody UsersRegistRequest usersRegistRequest) {
        userService.registerUser(usersRegistRequest);
        return ResponseEntity.ok().build();
    }

    //사용자 정보 조회
    @GetMapping("/user")
    public ResponseEntity<UserResponse> getUser(@RequestHeader("Authorization") String authHeader) {
        String userId = getUserIdFromHeader(authHeader);
        User users = userService.findById(userId);
        return ResponseEntity.ok().body(UserResponse
                .builder()
                .userId(userId)
                .nickName(users.getNickname())
                .email(users.getEmail())
                .role(users.getRole())
                .createAt(users.getCreateAt())
                .build()
        );
    }

    //사용자 정보 수정 API
    @PutMapping("/user/info")
    public ResponseEntity<UserResponse> updateUser(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody UserUpdateRequest userRequest) {
        String userId = getUserIdFromHeader(authHeader);
        UserResponse userResponse = userService.updateUser(userId, userRequest);

        return ResponseEntity.ok().body(userResponse);
    }

    //사용자 비밀번호 변경
    @PutMapping("/user/info/password")
    public ResponseEntity<Void> updateUserPassword(@RequestHeader("Authorization") String authHeader, @Valid @RequestBody UserPasswordUpdateRequest newPasswordRequest) {
        String userId = getUserIdFromHeader(authHeader);
        userService.updatePassword(userId, newPasswordRequest.getOldPassword(), newPasswordRequest.getNewPassword());
        return ResponseEntity.ok().build();
    }

    //사용자 탈퇴
    @DeleteMapping("/user")
    public ResponseEntity<Void> deleteUser(@RequestHeader("Authorization") String authHeader) {
        String userId = getUserIdFromHeader(authHeader);
        //userId를 이용하여 삭제
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    //Header에 있는 accessToken에서 Email 추출
    private String getUserIdFromHeader(String authHeader) {
        String accessToken = authHeader.replace("Bearer ", "");
        return tokenService.findUserIdByToken(accessToken);
    }

    // -----Login & Logout -------------------------------

    //로그인 API 호출
    @PostMapping("/user/login")
    public ResponseEntity<UserResponse> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletResponse response) {
        UserResponse userResponse = userService.login(loginRequest.getUserId(), loginRequest.getPassword());

        String accessToken = tokenService.createAccessToken(userResponse.getUserId(), userResponse.getRole());
        String refreshToken = tokenService.createRefreshToken(userResponse.getUserId(), userResponse.getRole());
        userResponse.setAccessToken(accessToken);

        ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(60 * 60 * 24)
                //로컬 테스트용 쿠키 설정
                .sameSite("Lax")
                .secure(false)
                //--------------------
                .build();
        response.addHeader("Set-Cookie", cookie.toString());

        return ResponseEntity.ok().body(userResponse);
    }

    //로그아웃 API 호출
    @DeleteMapping("/user/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request, HttpServletResponse response){
        // 1. 쿠키에서 refreshToken 꺼내기
        String refreshToken = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                    break;
                }
            }
        }

        // 2. refreshToken이 없으면 예외 처리
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // 3. 토큰 삭제 (ex. Redis에서 제거)
        tokenService.deleteRefreshToken(refreshToken);

        // 4. 브라우저 쿠키 삭제
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(false) // HTTPS 환경에선 true
                .path("/")
                .maxAge(0)
                .build();
        response.addHeader("Set-Cookie", deleteCookie.toString());

        return ResponseEntity.ok().build();
    }

}
