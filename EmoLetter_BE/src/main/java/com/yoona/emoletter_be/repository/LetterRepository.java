package com.yoona.emoletter_be.repository;

import com.yoona.emoletter_be.entity.Letter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface LetterRepository extends JpaRepository<Letter, Long> {
    // isOpened 필드의 값과 일치하는 모든 Letter를 조회하는 메소드
    // true를 넘기면 열린 편지만, false를 넘기면 닫힌 편지만 조회됩니다.
    List<Letter> findByIsOpened(boolean isOpened);

    // 로그인한 사용자의 편지만 isOpened 기준으로 조회
    List<Letter> findByUser_UserIdAndIsOpened(String userId, boolean isOpened);

    // 로그인한 사용자의 편지 한 건 조회 (다른 사람 편지를 열지 못하도록)
    Optional<Letter> findByLetterIdAndUser_UserId(Long letterId, String userId);

    // (1) 스케줄러용: 배달 시간이 지났고, 아직 isDelivered=false인 편지 조회
    List<Letter> findByDeliverDateBeforeAndIsDeliveredFalse(LocalDateTime now);

    // (2) 알림 API용: isDelivered=true 이고, 아직 isOpened=false인 편지 조회
    // isOpened 필드의 값과 일치하는 모든 Letter를 조회하는 메소드
    List<Letter> findByIsDeliveredTrueAndIsOpenedFalse();

    // (2-1) 알림 API용 (사용자 한정)
    List<Letter> findByUser_UserIdAndIsDeliveredTrueAndIsOpenedFalse(String userId);

    // (3) 회원 탈퇴용: user를 지우기 전에 이 사용자의 편지를 먼저 지운다.
    //     letter.user_id가 NOT NULL 외래 키라서 순서를 지키지 않으면 제약 위반으로 실패한다.
    void deleteByUser_UserId(String userId);
}
