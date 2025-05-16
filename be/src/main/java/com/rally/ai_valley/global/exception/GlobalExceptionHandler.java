package com.rally.ai_valley.global.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataAccessException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    // CustomException 처리 - 모든 커스텀 예외를 한 곳에서 처리
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ErrorResponse> handleCustomException(CustomException e) {
        ErrorCode errorCode = e.getErrorCode();

        // 로그 레벨을 상태 코드에 따라 다르게 설정
        if (errorCode.getStatus().is5xxServerError()) {
            log.error("서버 오류 발생: {}", e.getMessage(), e);
        } else {
            log.warn("클라이언트 오류 발생: {}", e.getMessage());
        }

        return createErrorResponse(errorCode, e.getMessage());
    }

    // IllegalArgumentException 처리
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgumentException(IllegalArgumentException e) {
        log.warn("잘못된 인자: {}", e.getMessage());
        return createErrorResponse(ErrorCode.INVALID_INPUT_VALUE, e.getMessage());
    }

    // DataAccessException 처리
    @ExceptionHandler(DataAccessException.class)
    public ResponseEntity<ErrorResponse> handleDataAccessException(DataAccessException e) {
        log.error("데이터베이스 오류: {}", e.getMessage(), e);
        return createErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, "데이터베이스 처리 중 오류가 발생했습니다.");
    }

    // 기타 처리되지 않은 예외
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGlobalException(Exception e) {
        log.error("처리되지 않은 예외: {}", e.getMessage(), e);
        return createErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR, "서버 처리 중 오류가 발생했습니다.");
    }

    // 에러 응답 생성 헬퍼 메서드
    private ResponseEntity<ErrorResponse> createErrorResponse(ErrorCode errorCode, String message) {
        ErrorResponse errorResponse = new ErrorResponse(errorCode.name(), message);
        return new ResponseEntity<>(errorResponse, errorCode.getStatus());
    }
}