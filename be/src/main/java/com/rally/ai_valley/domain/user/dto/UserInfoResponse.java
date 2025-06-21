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

    private final LocalDateTime createAt;

    @Builder
    public UserInfoResponse(Long userId, String email, String nickname, LocalDateTime createAt) {
        this.userId = userId;
        this.email = email;
        this.nickname = nickname;
        this.createAt = createAt;
    }

    public static UserInfoResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return UserInfoResponse.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .createAt(user.getCreatedAt())
                .build();
    }

}
