package com.yoona.emoletter_be.dto.user;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class UserPasswordUpdateRequest {
    private String oldPassword;
    private String newPassword;
}
