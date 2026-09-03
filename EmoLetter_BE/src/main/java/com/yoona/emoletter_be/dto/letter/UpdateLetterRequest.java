package com.yoona.emoletter_be.dto.letter;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Getter
public class UpdateLetterRequest {
    private String title;
    private String content;
    private LocalDateTime deliverDate;
    private String noteCode;
}
