package com.rally.ai_valley.domain.user.service;

import com.rally.ai_valley.domain.user.dto.SignupRequest;
import com.rally.ai_valley.domain.user.dto.UserInfoResponse;
import com.rally.ai_valley.domain.user.dto.UserInfoUpdateRequest;
import com.rally.ai_valley.domain.user.entity.Role;
import com.rally.ai_valley.domain.user.entity.User;
import com.rally.ai_valley.domain.user.repository.UserRepository;
import com.rally.ai_valley.global.exception.CustomException;
import com.rally.ai_valley.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @InjectMocks
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    private SignupRequest signupRequest;
    private User user;
    private UserInfoUpdateRequest updateRequest;

    @BeforeEach
    void setUp() {
        signupRequest = new SignupRequest();
        signupRequest.setEmail("test@example.com");
        signupRequest.setPassword("password123");
        signupRequest.setPasswordConfirm("password123");
        signupRequest.setNickname("testUser");

        user = User.create(
            signupRequest.getEmail(),
            signupRequest.getPassword(),
            signupRequest.getNickname(),
            Role.ROLE_USER
        );

        updateRequest = new UserInfoUpdateRequest();
        updateRequest.setNickname("newNick");
    }

    @Test
    @DisplayName("회원가입 성공 테스트")
    void createUser_Success() {
        // given
        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        userService.createUser(signupRequest);

        // then
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("이메일 중복 체크 테스트 - 중복된 이메일")
    void checkEmailDuplicate_Duplicate() {
        // given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(user));

        // when
        boolean isDuplicate = userService.isEmailDuplicate(signupRequest.getEmail());

        // then
        assertThat(isDuplicate).isTrue();
        verify(userRepository).findByEmail(signupRequest.getEmail());
    }

    @Test
    @DisplayName("이메일 중복 체크 테스트 - 사용 가능한 이메일")
    void checkEmailDuplicate_Available() {
        // given
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        // when
        boolean isDuplicate = userService.isEmailDuplicate(signupRequest.getEmail());

        // then
        assertThat(isDuplicate).isFalse();
        verify(userRepository).findByEmail(signupRequest.getEmail());
    }

    @Test
    @DisplayName("닉네임 중복 체크 테스트 - 중복된 닉네임")
    void checkNicknameDuplicate_Duplicate() {
        // given
        when(userRepository.findByNickname(anyString())).thenReturn(Optional.of(user));

        // when
        boolean isDuplicate = userService.isNicknameDuplicate(signupRequest.getNickname());

        // then
        assertThat(isDuplicate).isTrue();
        verify(userRepository).findByNickname(signupRequest.getNickname());
    }

    @Test
    @DisplayName("닉네임 중복 체크 테스트 - 사용 가능한 닉네임")
    void checkNicknameDuplicate_Available() {
        // given
        when(userRepository.findByNickname(anyString())).thenReturn(Optional.empty());

        // when
        boolean isDuplicate = userService.isNicknameDuplicate(signupRequest.getNickname());

        // then
        assertThat(isDuplicate).isFalse();
        verify(userRepository).findByNickname(signupRequest.getNickname());
    }

    @Test
    @DisplayName("사용자 정보 조회 테스트 - 성공")
    void getUserInfo_Success() {
        // given
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));

        // when
        UserInfoResponse response = userService.getUserInfo(1L);

        // then
        assertThat(response).isNotNull();
        assertThat(response.getEmail()).isEqualTo(user.getEmail());
        assertThat(response.getNickname()).isEqualTo(user.getNickname());
        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("사용자 정보 조회 테스트 - 실패 (존재하지 않는 사용자)")
    void getUserInfo_Failure_UserNotFound() {
        // given
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.getUserInfo(1L))
            .isInstanceOf(CustomException.class)
            .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_NOT_FOUND);
        verify(userRepository).findById(1L);
    }

    @Test
    @DisplayName("사용자 정보 업데이트 테스트 - 성공")
    void updateUserInfo_Success() {
        // given
        when(userRepository.findById(anyLong())).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);

        // when
        userService.updateUserInfo(1L, updateRequest);

        // then
        verify(userRepository).findById(1L);
        verify(userRepository).save(any(User.class));
    }

    @Test
    @DisplayName("사용자 정보 업데이트 테스트 - 실패 (존재하지 않는 사용자)")
    void updateUserInfo_Failure_UserNotFound() {
        // given
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> userService.updateUserInfo(1L, updateRequest))
            .isInstanceOf(CustomException.class)
            .hasFieldOrPropertyWithValue("errorCode", ErrorCode.USER_NOT_FOUND);
        verify(userRepository).findById(1L);
        verify(userRepository, never()).save(any(User.class));
    }
} 