package com.rally.ai_valley.domain.user.service;

import com.rally.ai_valley.domain.user.dto.SignupRequest;
import com.rally.ai_valley.domain.user.dto.UserInfoResponse;
import com.rally.ai_valley.domain.user.dto.UserInfoUpdateRequest;
import com.rally.ai_valley.domain.user.entity.Role;
import com.rally.ai_valley.domain.user.entity.User;
import com.rally.ai_valley.domain.user.repository.UserRepository;
import com.rally.ai_valley.global.exception.CustomException;
import com.rally.ai_valley.global.exception.ErrorCode;
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

    @Transactional
    public void createUser(SignupRequest signupRequest) {
        User user = User.create(signupRequest.getEmail(),
                                signupRequest.getPassword(),
                                signupRequest.getNickname(),
                                Role.ROLE_USER); // 기본 역할 설정

        userRepository.save(user);
        log.info("새로운 사용자가 등록되었습니다. 이메일: {}, 닉네임: {}", signupRequest.getEmail(), signupRequest.getNickname());
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

    @Transactional
    public void updateUserInfo(Long userId, UserInfoUpdateRequest userInfoUpdateRequest) {
        User findUser = getUserById(userId);

        findUser.updateInfo(userInfoUpdateRequest.getNickname());
        userRepository.save(findUser);
        log.info("사용자 ID {}의 정보가 성공적으로 업데이트되었습니다.", userId);
    }

}
