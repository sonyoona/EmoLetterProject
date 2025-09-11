package com.yoona.emoletter_be.dto.diary;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UpdateDiaryRequest {
    private String content;
    private LocalDateTime createAt;
    private String emojiCode;
}
