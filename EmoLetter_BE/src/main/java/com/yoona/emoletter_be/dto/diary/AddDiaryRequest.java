package com.yoona.emoletter_be.dto.diary;

import com.yoona.emoletter_be.entity.Diary;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor //파라미터 없는 생성자 생성
@AllArgsConstructor //모든 파라미터를 가진 생성자 생성
@Getter
@Setter
public class AddDiaryRequest {
    private String content;
    private LocalDateTime createAt;
    private String userId;
    private String emojiCode;

    public Diary toEntity(){
        return Diary.builder()
                .content(content)
                .createAt(createAt)
                .userId(userId)
                .emojiCode(emojiCode)
                .build();
    }
}
