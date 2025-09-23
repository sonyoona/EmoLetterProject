package com.yoona.emoletter_be.dto.user;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AddUserRequest {
    private String userId;
    private String email;
    private String password;
    private String nickname;
    private LocalDateTime createAt;
    private String role;
}
