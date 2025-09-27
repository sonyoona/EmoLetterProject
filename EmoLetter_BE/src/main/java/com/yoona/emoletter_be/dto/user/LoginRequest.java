package com.yoona.emoletter_be.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.validation.constraints.NotBlank;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "아이디는 필수 입력값입니다.")
    private String userId;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    private String password;
}
