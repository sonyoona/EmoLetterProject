package com.yoona.emoletter_be.dto.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class UserResponse {
    private String userId;
    private String nickName;
    private String role;
    private String email;
    private LocalDateTime createAt;
    private String accessToken;

    @Builder
    public UserResponse(String userId, String nickName, String role, String email, LocalDateTime createAt, String accessToken) {
        this.userId = userId;
        this.nickName = nickName;
        this.role = role;
        this.email = email;
        this.createAt = createAt;
        this.accessToken = accessToken;
    }
}
