package com.yoona.emoletter_be.dto.token;

import lombok.Getter;
import lombok.Setter;
import org.springframework.stereotype.Service;

@Getter
@Setter
public class TokenRequest {
    private String refreshToken;
}
