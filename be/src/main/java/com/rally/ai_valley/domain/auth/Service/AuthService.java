package com.rally.ai_valley.domain.auth.Service;

import com.rally.ai_valley.domain.auth.dto.EmailRequest;
import com.rally.ai_valley.domain.auth.dto.LoginRequest;
import com.rally.ai_valley.domain.auth.dto.TokenResponse;
import com.rally.ai_valley.domain.user.entity.User;
import com.rally.ai_valley.domain.user.repository.UserRepository;
import com.rally.ai_valley.global.exception.CustomException;
import com.rally.ai_valley.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public void sendVerifyEmail(EmailRequest emailRequest) {
        // 이메일 중복 검사 예외 흐름 추가
        if (userRepository.existsByEmail(emailRequest.getEmailAddr())) {
            throw new CustomException(ErrorCode.DUPLICATE_EMAIL, "이메일 " + emailRequest.getEmailAddr() + "는 이미 등록되어 있습니다.");
        }

        String verificationCode = UUID.randomUUID().toString();

        try {
            emailService.sendHtmlEmail(emailRequest.getEmailAddr(), verificationCode);
            log.info("이메일 주소 {}로 인증 코드가 발송되었습니다.", emailRequest.getEmailAddr());
        } catch (Exception e) {
            log.error("이메일 발송 실패: {}", e.getMessage(), e);
            throw new CustomException(ErrorCode.EMAIL_SEND_FAIL, "인증 이메일 발송 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    public TokenResponse login(LoginRequest loginRequest) {
        // 사용자 인증 로직
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_CREDENTIALS, "이메일 또는 비밀번호가 올바르지 않습니다."));

        // TODO: 이메일, 비밀번호 검증 로직

        // 토큰 생성 로직 (JWT 등)
        // String accessToken = jwtTokenProvider.generateAccessToken(user);
        // String refreshToken = jwtTokenProvider.generateRefreshToken(user);
        String accessToken = "test-access-token";
        String refreshToken = "test-refresh-token";

        log.info("사용자 {} 로그인 성공", user.getEmail());
        return new TokenResponse(accessToken, refreshToken);
    }

    public void logout() {
        // TODO: 로그아웃 처리 로직 구현
        // JWT 블랙리스트에 추가, Redis에서 리프레시 토큰 삭제 등
        log.info("로그아웃 처리 되었습니다.");
    }

}
