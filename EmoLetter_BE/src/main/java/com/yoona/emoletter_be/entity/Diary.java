package com.yoona.emoletter_be.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "diary")
@Getter
@NoArgsConstructor
public class Diary {
    @Id
    @Column(name = "diary_id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long diaryId;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name="create_at", nullable = false)
    private LocalDateTime createAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY) // N:1 관계 (일기 여러 개 -> 사용자 한 명)
    @JoinColumn(name = "user_id",       // Diary 테이블의 외래 키 컬럼 이름
            referencedColumnName = "user_id", // User 테이블의 기본 키 컬럼 이름 (String userId)
            nullable = false)
    private User user; // User 엔티티 객체

    // 핵심 부분! DB에는 코드만 저장됨
    @Column(name="emoji_code", nullable = false)
    private String emojiCode;

    @Builder
    public Diary(String content, LocalDateTime createAt, User user, String emojiCode) { // String userId -> User user로 변경
        this.content = content;
        this.createAt = createAt;
        this.user = user;
        this.emojiCode = emojiCode;
    }

    public void update(String content, LocalDateTime createAt, String emojiCode) {
        this.content = content;
        this.createAt = createAt;
        this.emojiCode = emojiCode;
    }
}
