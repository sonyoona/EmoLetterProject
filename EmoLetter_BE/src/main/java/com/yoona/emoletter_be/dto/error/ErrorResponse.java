package com.yoona.emoletter_be.dto.error;

import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 클라이언트에게 나가는 오류 응답.
 *
 * message에는 사용자에게 그대로 보여줄 수 있는 문장만 담는다.
 * 예외 메시지, 스택트레이스, SQL, 호스트 이름 같은 내부 정보는 절대 넣지 않는다.
 * 그런 것들은 GlobalExceptionHandler가 서버 콘솔에만 기록한다.
 */
@Getter
public class ErrorResponse {
    private final int status;
    private final String message;
    private final String path;
    private final LocalDateTime timestamp;

    public ErrorResponse(int status, String message, String path) {
        this.status = status;
        this.message = message;
        this.path = path;
        this.timestamp = LocalDateTime.now();
    }
}
