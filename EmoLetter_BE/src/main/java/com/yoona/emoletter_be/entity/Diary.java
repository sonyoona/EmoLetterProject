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

    @Column(name="user_id", nullable = false)
    private String userId;

    // 핵심 부분! DB에는 코드만 저장됨
    @Column(name="emoji_code", nullable = false)
    private String emojiCode;

    @Builder
    public Diary(String content, LocalDateTime createAt, String userId, String emojiCode) {
        this.content = content;
        this.createAt = createAt;
        this.userId = userId;
        this.emojiCode = emojiCode;
    }

    public void update(String content, LocalDateTime createAt, String emojiCode) {
        this.content = content;
        this.createAt = createAt;
        this.emojiCode = emojiCode;
    }
}
