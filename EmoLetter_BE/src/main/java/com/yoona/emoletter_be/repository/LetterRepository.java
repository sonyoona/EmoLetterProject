package com.yoona.emoletter_be.repository;

import com.yoona.emoletter_be.entity.Letter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface LetterRepository extends JpaRepository<Letter, Long> {
    // isOpened 필드의 값과 일치하는 모든 Letter를 조회하는 메소드
    // true를 넘기면 열린 편지만, false를 넘기면 닫힌 편지만 조회됩니다.
    List<Letter> findByIsOpened(boolean isOpened);

    // (1) 스케줄러용: 배달 시간이 지났고, 아직 isDelivered=false인 편지 조회
    List<Letter> findByDeliverDateBeforeAndIsDeliveredFalse(LocalDateTime now);

    // (2) 알림 API용: isDelivered=true 이고, 아직 isOpened=false인 편지 조회
    // isOpened 필드의 값과 일치하는 모든 Letter를 조회하는 메소드
    List<Letter> findByIsDeliveredTrueAndIsOpenedFalse();
}
