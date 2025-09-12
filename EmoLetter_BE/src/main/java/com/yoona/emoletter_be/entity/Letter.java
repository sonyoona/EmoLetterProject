package com.yoona.emoletter_be.entity;

import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "letter")
@Getter
@NoArgsConstructor
public class Letter {
    @Id
    @Column(name = "letter_id", updatable = false)
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long letterId;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name="deliver_date", nullable = false)
    private LocalDateTime deliverDate;

    @Column(name="is_opened", nullable = false)
    private boolean isOpened = false;

    @Column(name="create_at", nullable = false)
    private LocalDateTime createAt = LocalDateTime.now();

    @Column(name="user_id", nullable = false)
    private String userId;

    // 핵심 부분! DB에는 코드만 저장됨
    @Column(name="note_code", nullable = false)
    private String noteCode;

    @Builder
    public Letter(String content, LocalDateTime deliverDate, boolean isOpened, LocalDateTime createAt, String userId, String noteCode) {
        this.content = content;
        this.deliverDate = deliverDate;
        this.createAt = createAt;
        this.isOpened = isOpened;
        this.userId = userId;
        this.noteCode = noteCode;
    }

    public void updateIsOpened(boolean isOpened) {
        this.isOpened = isOpened;
    }

    public void update(String content, LocalDateTime deliverDate, LocalDateTime createAt, String noteCode) {
        this.content = content;
        this.deliverDate = deliverDate;
        this.createAt = createAt;
        this.noteCode = noteCode;
    }
}

