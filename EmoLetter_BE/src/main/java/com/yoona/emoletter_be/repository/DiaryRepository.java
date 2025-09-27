package com.yoona.emoletter_be.repository;

import com.yoona.emoletter_be.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DiaryRepository extends JpaRepository<Diary, Long> {
    /**
     * 특정 User의 userId를 기준으로 해당 User가 작성한 모든 Diary를 조회합니다.
     * * 규칙 설명:
     * - findBy: 조회 시작
     * - User: Diary 엔티티 내의 'user' 필드 (FK 관계)
     * - UserId: User 엔티티 내의 'userId' 필드 (User의 PK)
     * * @param userId User 엔티티의 고유 ID (String 타입)
     * @return 해당 userId를 가진 사용자가 작성한 Diary 목록
     */
    List<Diary> findByUser_UserId(String userId);

    // 필요하다면 특정 ID의 일기가 현재 사용자의 것인지 확인하는 메서드도 추가할 수 있습니다.
    Optional<Diary> findByDiaryIdAndUser_UserId(Long diaryId, String userId);
}
