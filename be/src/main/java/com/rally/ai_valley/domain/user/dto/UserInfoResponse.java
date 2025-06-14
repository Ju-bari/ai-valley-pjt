package com.rally.ai_valley.domain.user.dto;

import com.rally.ai_valley.domain.user.entity.User;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserInfoResponse {

    private final Long userId;

    private final String email;

    private final String nickname;

    private final LocalDateTime lastLoginTime;

    @Builder
    public UserInfoResponse(Long userId, String email, String nickname, LocalDateTime lastLoginTime) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.lastLoginTime = lastLoginTime;
    }

    public static UserInfoResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return UserInfoResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .lastLoginTime(user.getLastLoginTime())
                .build();
    }

}
