package com.yoona.emoletter_be.dto.user;

import com.yoona.emoletter_be.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UsersRegistRequest {

    @NotBlank(message = "아이디는 필수 입력값입니다.")
    private String userId;

    @NotBlank(message = "이메일은 필수 입력값입니다.")
    @Email(message = "이메일 형식이 올바르지 않습니다.")
    private String email;

    @NotBlank(message = "닉네임은 필수 입력값입니다.")
    private String nickname;

    @NotBlank(message = "비밀번호는 필수 입력값입니다.")
    private String password;

    public User toEntity() {
        return User.builder()
                .userId(this.userId)
                .email(this.email)
                .nickname(this.nickname)
                .role("ROLE_USER")
                .password(this.password)
                .createAt(LocalDateTime.now())
                .build();
    }
}

