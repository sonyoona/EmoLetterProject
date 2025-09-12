package com.yoona.emoletter_be.dto.letter;

import com.yoona.emoletter_be.entity.Letter;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class AddLetterRequest {
    private String content;
    private LocalDateTime deliverDate;
    private boolean isOpened;
    private LocalDateTime createAt;
    private String noteCode;
    private String userId;

    public Letter toEntity() {
        return Letter.builder()
                .content(content)
                .deliverDate(deliverDate)
                .isOpened(isOpened)
                .createAt(createAt)
                .noteCode(noteCode)
                .userId(userId)
                .build();
    }
}
