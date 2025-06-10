package com.rally.ai_valley.domain.user.entity;

import com.rally.ai_valley.domain.user.dto.SignupRequest;
import com.rally.ai_valley.domain.user.dto.UserInfoUpdateRequest;
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
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setNickname("testUser");

        // when
        User user = User.create(signupRequest);

        // then
        assertThat(user.getEmail()).isEqualTo(signupRequest.getEmail());
        assertThat(user.getPassword()).isEqualTo(signupRequest.getPassword());
        assertThat(user.getNickname()).isEqualTo(signupRequest.getNickname());
        assertThat(user.getRole()).isEqualTo(Role.ROLE_USER);
        assertThat(user.getIsActive()).isEqualTo(1);
        assertThat(user.getClones()).isEmpty();
        assertThat(user.getBoards()).isEmpty();
    }

    @Test
    @DisplayName("User 엔티티 마지막 로그인 시간 업데이트 테스트")
    void updateLastLoginTime() {
        // given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setNickname("testUser");

        User user = User.create(signupRequest);

        // when
        user.updateLastLoginTime();

        // then
        assertThat(user.getLastLoginTime()).isNotNull();
    }

    @Test
    @DisplayName("User 엔티티 닉네임 업데이트 테스트 - 성공")
    void updateInfo_Success() {
        // given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setNickname("testUser");

        User user = User.create(signupRequest);

        String newNickname = "newNick";
        UserInfoUpdateRequest userInfoUpdateRequest = new UserInfoUpdateRequest();
        userInfoUpdateRequest.setNickname(newNickname);

        // when
        user.updateInfo(userInfoUpdateRequest);

        // then
        assertThat(user.getNickname()).isEqualTo(newNickname);
    }

    @ParameterizedTest
    @ValueSource(strings = {"", " ", "a", "abcdefghijklmnopqrstuvwxyz"})
    @DisplayName("User 엔티티 닉네임 업데이트 테스트 - 실패 (유효하지 않은 닉네임)")
    void updateInfo_Failure(String invalidNickname) {
        // given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setNickname("testUser");

        User user = User.create(signupRequest);

        String newNickname = "newNick";
        UserInfoUpdateRequest userInfoUpdateRequest = new UserInfoUpdateRequest();
        userInfoUpdateRequest.setNickname(newNickname);

        // when & then
        assertThatThrownBy(() -> user.updateInfo(userInfoUpdateRequest))
            .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    @DisplayName("User 엔티티 닉네임 업데이트 테스트 - 실패 (null 닉네임)")
    void updateInfo_Failure_NullNickname() {
        // given
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setNickname("testUser");

        User user = User.create(signupRequest);

        // when & then
        assertThatThrownBy(() -> user.updateInfo(null))
            .isInstanceOf(IllegalArgumentException.class)
            .hasMessageContaining("닉네임은 비어있을 수 없습니다.");
    }
} 