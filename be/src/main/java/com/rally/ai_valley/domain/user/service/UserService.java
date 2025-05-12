package com.rally.ai_valley.domain.user.service;

import com.rally.ai_valley.domain.user.dto.UserSignupDto;
import com.rally.ai_valley.domain.user.entity.User;
import com.rally.ai_valley.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;

    public boolean createUser(UserSignupDto userSignupDto) {
        User user = User.builder()
                .email(userSignupDto.getEmail())
                .password(userSignupDto.getPassword())
                .nickname(userSignupDto.getNickname())
                .role("USER")  // 기본 역할은 일반 사용자로 설정
                .build();

        userRepository.save(user);
        return true;
    }
}
