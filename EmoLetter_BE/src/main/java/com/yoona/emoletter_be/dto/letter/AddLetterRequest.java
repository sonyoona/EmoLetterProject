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
    private String noteCode;

    public Letter toEntity() {
        return Letter.builder()
                .content(content)
                .deliverDate(deliverDate)
                .noteCode(noteCode)
                .build();
    }
}
