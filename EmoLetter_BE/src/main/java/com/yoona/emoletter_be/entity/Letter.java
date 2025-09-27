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


    @ManyToOne(fetch = FetchType.LAZY) // N:1 관계 (편지 여러 개 -> 사용자 한 명)
    @JoinColumn(name = "user_id", // Letter 테이블의 외래 키 컬럼 이름 (DB 컬럼 이름과 동일하게)
            referencedColumnName = "user_id", // User 테이블의 참조할 컬럼 이름 (User의 @Id 필드)
            nullable = false)
    private User user;


    // 핵심 부분! DB에는 코드만 저장됨
    @Column(name="note_code", nullable = false)
    private String noteCode;

//    @Builder
//    public Letter(String content, LocalDateTime deliverDate, boolean isOpened, LocalDateTime createAt, String userId, String noteCode) {
//        this.content = content;
//        this.deliverDate = deliverDate;
//        this.createAt = createAt;
//        this.isOpened = isOpened;
//        this.userId = userId;
//        this.noteCode = noteCode;
//    }
    @Builder
    public Letter(String content, LocalDateTime deliverDate, User user, String noteCode) {
        this.content = content;
        this.deliverDate = deliverDate;
        // createAt, isOpened는 필드 초기화 값 사용 (생성자에서는 제외하거나 명시적으로 설정)
        // this.createAt = createAt; // 이 필드는 new Letter() 시점에 초기화되므로 필요하지 않을 수 있습니다.
        // this.isOpened = isOpened; // 이 필드는 초기화 값(false)이 있으므로 필요하지 않을 수 있습니다.
        this.user = user; // User 객체로 변경
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

