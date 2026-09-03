package com.yoona.emoletter_be.dto.letter;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.yoona.emoletter_be.entity.Letter;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class LetterResponse {
    private Long letterId;
    private String title;
    private String content;
    private LocalDateTime deliverDate;

    // Lombok이 만드는 getter가 isOpened()/isDelivered()라 Jackson 기본 이름은 opened/delivered가 된다.
    // 프런트가 쓰는 필드명과 맞추기 위해 직렬화 이름을 명시한다.
    @JsonProperty("isOpened")
    private boolean isOpened;

    @JsonProperty("isDelivered")
    private boolean isDelivered;

    private LocalDateTime createAt;
    private String noteCode;
    private String nickname;

    public LetterResponse(Letter letter){
        this.letterId = letter.getLetterId();
        this.title = letter.getTitle();
        this.content = letter.getContent();
        this.deliverDate = letter.getDeliverDate();
        this.isOpened = letter.isOpened();
        this.isDelivered = letter.isDelivered();
        this.createAt = letter.getCreateAt();
        this.noteCode = letter.getNoteCode();
        this.nickname = letter.getUser().getNickname();
    }
}
