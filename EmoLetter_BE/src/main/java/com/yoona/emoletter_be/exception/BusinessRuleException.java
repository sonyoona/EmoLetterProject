package com.yoona.emoletter_be.exception;

import org.springframework.http.HttpStatus;

/**
 * 서비스 규칙에 어긋나는 요청일 때 던진다.
 * (예: 이미 도착한 편지를 수정하려는 경우)
 *
 * IllegalArgumentException과 나눈 이유:
 *  - IllegalArgumentException은 "없는 id" 같은 내부 사정이라 사용자에게 문구를 보여줄 수 없다.
 *  - 이 예외는 사용자가 무엇을 잘못했는지 알아야 고칠 수 있는 상황이므로 문구를 그대로 내보낸다.
 */
public class BusinessRuleException extends RuntimeException {

    private final HttpStatus status;

    /** 로그에만 남길 상세. 아이디처럼 사용자에게 돌려주면 안 되는 값을 담는다. */
    private final String detailForLog;

    public BusinessRuleException(String userMessage) {
        this(userMessage, HttpStatus.BAD_REQUEST, null);
    }

    public BusinessRuleException(String userMessage, String detailForLog) {
        this(userMessage, HttpStatus.BAD_REQUEST, detailForLog);
    }

    public BusinessRuleException(String userMessage, HttpStatus status) {
        this(userMessage, status, null);
    }

    public BusinessRuleException(String userMessage, HttpStatus status, String detailForLog) {
        super(userMessage);
        this.status = status;
        this.detailForLog = detailForLog;
    }

    public HttpStatus getStatus() {
        return status;
    }

    /** 로그용 문구. 따로 주지 않았으면 사용자 문구를 그대로 쓴다. */
    public String getDetailForLog() {
        return detailForLog != null ? detailForLog : getMessage();
    }
}
