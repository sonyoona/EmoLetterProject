package com.yoona.emoletter_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling; // 👈 이 어노테이션 추가

@EnableScheduling // 스케줄링 활성화
@SpringBootApplication
public class EmoLetterBeApplication {

    public static void main(String[] args) {
        SpringApplication.run(EmoLetterBeApplication.class, args);
    }

}
