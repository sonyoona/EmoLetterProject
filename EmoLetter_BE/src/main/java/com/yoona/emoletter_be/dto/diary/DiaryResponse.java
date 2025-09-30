package com.yoona.emoletter_be.dto.diary;

import com.yoona.emoletter_be.entity.Diary;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class DiaryResponse {
    private final String content;
    private final LocalDateTime createAt;
    private final String nickname;
    private final String emojiCode;

    public DiaryResponse(Diary diary){
        this.content = diary.getContent();
        this.createAt = diary.getCreateAt();
        this.nickname = diary.getUser().getNickname();
        this.emojiCode = diary.getEmojiCode();
    }

}
