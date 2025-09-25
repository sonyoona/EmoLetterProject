package com.yoona.emoletter_be.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id; // Redis 전용 @Id
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed; // 검색을 위한 인덱스

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
// 1일 유지 (timeToLive는 초 단위)
@RedisHash(value = "refreshToken", timeToLive = 60 * 60 * 24)
public class RefreshToken {

    // Redis의 Key로 사용할 User ID를 @Id로 지정
    @Id
    private String userId; // 이 필드가 Redis Key가 됩니다.

    // Refresh Token 값은 인덱스를 걸어 검색에 용이하게 합니다.
    @Indexed
    private String refreshToken;

    public RefreshToken updateRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
        return this;
    }
}