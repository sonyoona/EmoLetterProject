package com.yoona.emoletter_be.config.jwt;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Setter
@Getter
@Component
@ConfigurationProperties(prefix = "jwt")//자바 클래스에 프로피티값을 가져와서 사용하는 애너테이션
public class JwtProperties {
    //yml파일에 있는 사용자, 키 가져오기
    private String issuer;
    private String secretKey;
    private Expiration expiration;

    //yml 파일에 있는 토큰 유효기간 가져오기
    //static 선언 이유
    //static을 사용하면 큰 JwtProperties 상자를 만들지 않고도 Expiration이라는 작은 상자를 만들 수 있어서, 스프링이 더 빠르고 효율적으로 필요한 정보를 가져올 수 있어요.
    @Setter
    @Getter
    public static class Expiration {
        private long access;
        private long refresh;
    }
}