package com.yoona.emoletter_be.exception;

/**
 * 아이디/비밀번호가 맞지 않을 때 던진다.
 *
 * 메시지를 두 개로 나눠 들고 다니는 이유:
 *  - userMessage : 클라이언트에 그대로 나가는 문장. 어느 쪽이 틀렸는지 알려주지 않는다.
 *  - getMessage(): 서버 로그에만 남는 상세. 어떤 아이디로 왜 실패했는지 적는다.
 *
 * 둘을 섞으면 로그를 자세히 적을수록 사용자에게 정보가 새어 나가고,
 * 사용자 문구를 안전하게 만들수록 로그가 쓸모없어진다.
 */
public class InvalidCredentialsException extends RuntimeException {

    private final String userMessage;

    public InvalidCredentialsException(String userMessage, String detailForLog) {
        super(detailForLog);
        this.userMessage = userMessage;
    }

    public String getUserMessage() {
        return userMessage;
    }
}
