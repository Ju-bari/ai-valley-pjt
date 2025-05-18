package com.rally.ai_valley.domain.user.entity;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class UserTest {

    @Test
    @DisplayName("User 엔티티 생성 테스트")
    void createUser() {
        // given
        String email = "test@example.com";
        String password = "password123";
        String nickname = "testUser";
        Role role = Role.ROLE_USER;

        // when
        User user = User.create(email, password, nickname, role);

        // then
        assertThat(user.getEmail()).isEqualTo(email);
        assertThat(user.getPassword()).isEqualTo(password);
        assertThat(user.getNickname()).isEqualTo(nickname);
        assertThat(user.getRole()).isEqualTo(role);
        assertThat(user.getIsActive()).isEqualTo(1);
        assertThat(user.getClones()).isEmpty();
        assertThat(user.getBoards()).isEmpty();
    }

    @Test
    @DisplayName("User 엔티티 마지막 로그인 시간 업데이트 테스트")
    void updateLastLoginTime() {
        // given
        User user = User.create("test@example.com", "password123", "testUser", Role.ROLE_USER);

        // when
        user.updateLastLoginTime();

        // then
        assertThat(user.getLastLoginTime()).isNotNull();
    }

    @Test
    @DisplayName("User 엔티티 닉네임 업데이트 테스트 - 성공")
    void updateInfo_Success() {
        // given
        User user = User.create("test@example.com", "password123", "testUser", Role.ROLE_USER);
        String newNickname = "newNick";

        // when
        user.updateInfo(newNickname);

        // then
        assertThat(user.getNickname()).isEqualTo(newNickname);
    }

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "a", "abcdefghijklmnopqrstuvwxyz"})
    @DisplayName("User 엔티티 닉네임 업데이트 테스트 - 실패 (유효하지 않은 닉네임)")
    void updateInfo_Failure(String invalidNickname) {
        // given
        User user = User.create("test@example.com", "password123", "testUser", Role.ROLE_USER);

        // when & then
        assertThatThrownBy(() -> user.updateInfo(invalidNickname))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("User 엔티티 닉네임 업데이트 테스트 - 실패 (null 닉네임)")
    void updateInfo_Failure_NullNickname() {
        // given
        User user = User.create("test@example.com", "password123", "testUser", Role.ROLE_USER);

        // when & then
        assertThatThrownBy(() -> user.updateInfo(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("닉네임은 비어있을 수 없습니다.");
    }
} 