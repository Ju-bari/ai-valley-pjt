package com.rally.ai_valley.domain.user.entity;

import com.rally.ai_valley.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "role")
    private String role;

    @Column(name = "email_verified", nullable = false)
    private boolean emailVerified = false;

    @Column(name = "verification_token")
    private String verificationToken;

    @Column(name = "verification_token_expiry_date")
    private LocalDateTime verificationTokenExpiryDate;


    @Builder
    public User(String email, String password, String nickname, String role) {
        this.email = email;
        this.password = password;
        this.nickname = nickname;
        this.role = role;
        this.emailVerified = false;
    }

    // 이메일 인증 상태 업데이트 및 토큰 정보 초기화
    public void verifyEmail() {
        this.emailVerified = true;
        this.verificationToken = null; // 토큰 사용 후 무효화
        this.verificationTokenExpiryDate = null; // 만료 시간 정보도 초기화
    }

    // 인증 토큰 생성 및 만료 시간 설정
    public void generateVerificationToken() {
        this.verificationToken = UUID.randomUUID().toString();
        // 토큰 유효 시간 설정 -> 30분
        this.verificationTokenExpiryDate = LocalDateTime.now().plusMinutes(30);
    }

    // 토큰 만료 여부 확인
    public boolean isTokenExpired() {
        return this.verificationTokenExpiryDate != null && this.verificationTokenExpiryDate.isBefore(LocalDateTime.now());
    }
}
