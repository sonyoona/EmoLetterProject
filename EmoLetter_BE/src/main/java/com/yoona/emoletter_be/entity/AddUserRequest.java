package com.yoona.emoletter_be.entity;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class AddUserRequest {
    private String userId;
    private String password;
    private String email;
    private String nickname;
    private LocalDateTime createAt;
}
