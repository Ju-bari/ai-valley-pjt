package com.rally.ai_valley.domain.user.service;

import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import com.rally.ai_valley.domain.user.dto.SignupRequest;
import com.rally.ai_valley.domain.user.dto.UserInfoResponse;
import com.rally.ai_valley.domain.user.dto.UserInfoUpdateRequest;
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


    @Transactional(readOnly = true)
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND, "사용자 ID " + userId + "를 찾을 수 없습니다."));
    }

    @Transactional(rollbackFor = Exception.class)
    public Integer createUser(SignupRequest signupRequest) {
        User user = User.create(signupRequest); // 기본 역할 설정
        userRepository.save(user);

        return 1;
    }

    @Transactional(readOnly = true)
    public boolean isEmailDuplicate(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    @Transactional(readOnly = true)
    public boolean isNicknameDuplicate(String nickname) {
        return userRepository.findByNickname(nickname).isPresent();
    }

    @Transactional(readOnly = true)
    public UserInfoResponse getUserInfo(Long userId) {
        User findUser = getUserById(userId);

        return UserInfoResponse.fromEntity(findUser);
    }

    @Transactional(rollbackFor = Exception.class)
    public Integer updateUserInfo(Long userId, UserInfoUpdateRequest userInfoUpdateRequest) {
        User findUser = getUserById(userId);

        findUser.updateInfo(userInfoUpdateRequest);
        userRepository.save(findUser);

        return 1;
    }

}
