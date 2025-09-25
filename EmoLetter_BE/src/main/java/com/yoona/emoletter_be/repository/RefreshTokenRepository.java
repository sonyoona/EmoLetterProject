package com.yoona.emoletter_be.repository;

import com.yoona.emoletter_be.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

//redis
//@RedisHash를 사용하는 엔티티는 CrudRepository를 상속해야 하며, Key 타입은 String
public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    Optional<RefreshToken> findByRefreshToken(String refreshToken);
    Optional<RefreshToken> findByUserId(String userId);
    void deleteByUserId(String userId);
}