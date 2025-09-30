package com.yoona.emoletter_be.dto.letter;

import com.yoona.emoletter_be.entity.Letter;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class LetterResponse {
    private String content;
    private LocalDateTime deliverDate;
    private boolean isOpened;
    private LocalDateTime createAt;
    private String noteCode;
    private String nickname;

    public LetterResponse(Letter letter){
        this.content = letter.getContent();
        this.deliverDate = letter.getDeliverDate();
        this.isOpened = letter.isOpened();
        this.createAt = letter.getCreateAt();
        this.noteCode = letter.getNoteCode();
        this.nickname = letter.getUser().getNickname();
    }
}
