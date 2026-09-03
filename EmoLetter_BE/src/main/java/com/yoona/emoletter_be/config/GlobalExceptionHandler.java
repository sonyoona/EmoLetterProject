package com.yoona.emoletter_be.config;

import com.yoona.emoletter_be.config.jwt.JwtValidationException;
import com.yoona.emoletter_be.dto.error.ErrorResponse;
import com.yoona.emoletter_be.exception.BusinessRuleException;
import com.yoona.emoletter_be.exception.InvalidCredentialsException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.RedisConnectionFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

/**
 * 예외를 두 갈래로 나눠 처리한다.
 *
 *  - 사용자에게는 "무엇을 하면 되는지"만 알려주는 짧은 문장을 응답으로 보낸다.
 *    내부 사정(Redis가 죽었다, SQL이 틀렸다 등)은 알려줄 필요도 없고 알려줘서도 안 된다.
 *  - 개발자에게는 원인과 해결 힌트를 서버 콘솔에 남긴다.
 *    로그만 보면 무엇을 켜야 하는지 바로 알 수 있도록 힌트를 함께 찍는다.
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final String MSG_UNAVAILABLE =
            "서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    private static final String MSG_INTERNAL =
            "서버에 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
    private static final String MSG_BAD_REQUEST =
            "요청을 처리할 수 없습니다. 입력값을 확인해주세요.";

    /**
     * Redis 연결 실패.
     * 로그인/로그아웃/토큰 재발급이 refreshToken 저장소로 Redis를 쓰기 때문에 여기서 자주 걸린다.
     */
    @ExceptionHandler(RedisConnectionFailureException.class)
    public ResponseEntity<ErrorResponse> handleRedisDown(RedisConnectionFailureException e,
                                                         HttpServletRequest request) {
        logFailure("REDIS 연결 실패", request, e,
                "Redis가 실행 중인지 확인하세요. "
                        + "로컬(WSL): wsl -d Ubuntu-22.04 -u root -- systemctl start redis-server / "
                        + "확인: redis-cli ping. "
                        + "접속 주소는 spring.data.redis.host(기본 127.0.0.1:6379)로 설정합니다.");

        return build(HttpStatus.SERVICE_UNAVAILABLE, MSG_UNAVAILABLE, request);
    }

    /**
     * DB 연결/쿼리 실패. (Redis 예외는 위에서 먼저 잡히므로 여기까지 오지 않는다)
     */
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDatabase(DataAccessException e,
                                                        HttpServletRequest request) {
        logFailure("DB 접근 실패", request, e,
                "MySQL이 3306에서 실행 중인지, .env의 DATABASE_DB/USERNAME/PASSWORD가 맞는지 확인하세요.");

        return build(HttpStatus.SERVICE_UNAVAILABLE, MSG_UNAVAILABLE, request);
    }

    /**
     * 토큰 검증 실패. 예외가 직접 상태 코드를 들고 온다.
     */
    @ExceptionHandler(JwtValidationException.class)
    public ResponseEntity<ErrorResponse> handleJwt(JwtValidationException e,
                                                   HttpServletRequest request) {
        // 위조/만료는 서버 장애가 아니라 정상적인 흐름이므로 스택트레이스 없이 한 줄만 남긴다.
        log.warn("[{} {}] 토큰 검증 실패: {}", request.getMethod(), request.getRequestURI(), e.getMessage());

        return build(e.getStatus(), "다시 로그인해주세요.", request);
    }

    /**
     * 로그인 실패 / 현재 비밀번호 불일치.
     * 예외가 사용자용 문구를 직접 들고 오므로 그대로 내보낸다.
     */
    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(InvalidCredentialsException e,
                                                                  HttpServletRequest request) {
        // 사용자가 비밀번호를 틀리는 건 장애가 아니므로 한 줄만 남긴다.
        log.warn("[{} {}] {}", request.getMethod(), request.getRequestURI(), e.getMessage());

        return build(HttpStatus.UNAUTHORIZED, e.getUserMessage(), request);
    }

    /**
     * 요청 본문을 읽지 못했을 때. (JSON 형식 오류, 잘못된 인코딩, 날짜 형식 불일치 등)
     *
     * 기본값으로 두면 500이 나가는데, 이건 서버가 아니라 요청이 잘못된 것이므로 400이 맞다.
     * 500으로 보이면 원인을 서버에서 찾게 되어 디버깅이 크게 돌아간다.
     */
    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadableBody(HttpMessageNotReadableException e,
                                                              HttpServletRequest request) {
        log.warn("[{} {}] 본문을 읽을 수 없음: {}",
                request.getMethod(), request.getRequestURI(), rootCauseOf(e));

        return build(HttpStatus.BAD_REQUEST, MSG_BAD_REQUEST, request);
    }

    /**
     * 서비스 규칙 위반. (예: 이미 도착한 편지 수정)
     * 사용자가 무엇을 잘못했는지 알아야 고칠 수 있으므로 예외 문구를 그대로 내보낸다.
     */
    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<ErrorResponse> handleBusinessRule(BusinessRuleException e,
                                                            HttpServletRequest request) {
        log.warn("[{} {}] 규칙 위반: {}", request.getMethod(), request.getRequestURI(), e.getDetailForLog());

        return build(e.getStatus(), e.getMessage(), request);
    }

    /**
     * 서비스 계층이 던지는 검증 실패.
     * 예외 메시지에 아이디 같은 값이 그대로 담겨 있어 사용자에게 노출하지 않는다.
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException e,
                                                               HttpServletRequest request) {
        log.warn("[{} {}] 잘못된 요청: {}", request.getMethod(), request.getRequestURI(), e.getMessage());

        return build(HttpStatus.BAD_REQUEST, MSG_BAD_REQUEST, request);
    }

    /**
     * 위에서 걸리지 않은 모든 예외.
     * 여기까지 왔다는 건 예상하지 못한 상황이므로 스택트레이스를 통째로 남긴다.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception e, HttpServletRequest request) {
        logFailure("처리되지 않은 예외", request, e,
                "위 스택트레이스의 맨 아래 Caused by를 먼저 확인하세요.");

        return build(HttpStatus.INTERNAL_SERVER_ERROR, MSG_INTERNAL, request);
    }

    // ---------------------------------------------------------------

    /** 콘솔에 원인과 해결 힌트를 함께 남긴다. */
    private void logFailure(String title, HttpServletRequest request, Exception e, String hint) {
        log.error("""

                        ┌─ {} ────────────────────────────────
                        │ 요청 : {} {}
                        │ 원인 : {}
                        │ 조치 : {}
                        └──────────────────────────────────────""",
                title,
                request.getMethod(), request.getRequestURI(),
                rootCauseOf(e),
                hint,
                e);
    }

    /** 스택을 타고 내려가 가장 근본 원인을 찾는다. (ConnectException 등) */
    private String rootCauseOf(Throwable e) {
        Throwable cause = e;
        while (cause.getCause() != null && cause.getCause() != cause) {
            cause = cause.getCause();
        }
        return cause.getClass().getSimpleName() + ": " + cause.getMessage();
    }

    private ResponseEntity<ErrorResponse> build(HttpStatus status, String message,
                                                HttpServletRequest request) {
        return ResponseEntity.status(status)
                .body(new ErrorResponse(status.value(), message, request.getRequestURI()));
    }
}
