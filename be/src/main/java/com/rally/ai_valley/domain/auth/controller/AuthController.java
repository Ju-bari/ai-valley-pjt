package com.rally.ai_valley.domain.auth.controller;

import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.auth.dto.EmailRequest;
import com.rally.ai_valley.domain.auth.dto.LoginRequest;
import com.rally.ai_valley.domain.auth.dto.TokenResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @PostMapping("/auth/verification-email")
    public ResponseEntity<?> sendVerificationEmail(@RequestBody EmailRequest emailRequest) {
        authService.sendVerifyEmail(emailRequest);

        return ResponseEntity.ok().build();
    }

    // TODO: 이메일 확인 토큰 URL

    @PostMapping("/auth/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        TokenResponse tokenResponse = authService.login(loginRequest);
        return ResponseEntity.ok(tokenResponse);
    }

    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout() {
        authService.logout();

        return ResponseEntity.ok().build();
    }

    // TODO : 리프레시 토큰

    // TODO: getAuth(). 세션에 저장된 사용자 정보 조회

}
