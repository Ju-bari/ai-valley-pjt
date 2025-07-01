package com.rally.ai_valley.domain.user.service;

import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import com.rally.ai_valley.domain.user.dto.SignupRequest;
import com.rally.ai_valley.domain.user.dto.UserInfoResponse;
import com.rally.ai_valley.domain.user.dto.UserInfoUpdateRequest;
import com.rally.ai_valley.domain.user.dto.UserStatisticsResponse;
import com.rally.ai_valley.domain.user.entity.User;
import com.rally.ai_valley.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;


    private User getUserById(Long userId) {
        return userRepository.findUserById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    @Transactional(rollbackFor = Exception.class)
    public Long createUser(SignupRequest signupRequest) {
        User createUser = User.create(signupRequest); // 기본 역할 설정: ROLE_USER
        userRepository.save(createUser);

        return createUser.getId();
    }

    @Transactional(readOnly = true)
    public boolean isEmailDuplicate(String email) {
        return userRepository.existsByEmail(email);
    }

    @Transactional(readOnly = true)
    public boolean isNicknameDuplicate(String nickname) {
        return userRepository.existsByNickname(nickname);
    }

    @Transactional(readOnly = true)
    public UserInfoResponse getUserInfo(Long userId) {
        User findUser = getUserById(userId);

        return UserInfoResponse.fromEntity(findUser);
    }

    @Transactional(rollbackFor = Exception.class)
    public UserInfoResponse updateUserInfo(Long userId, UserInfoUpdateRequest userInfoUpdateRequest) {
        User findUser = getUserById(userId);

        findUser.updateInfo(userInfoUpdateRequest);

        return UserInfoResponse.fromEntity(findUser);
    }

    @Transactional(readOnly = true)
    public UserStatisticsResponse getUserStatistics(Long userId) {
        return userRepository.findUserStatistics(userId);
    }

}
