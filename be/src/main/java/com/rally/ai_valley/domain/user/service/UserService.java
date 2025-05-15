package com.rally.ai_valley.domain.user.service;

import com.rally.ai_valley.domain.user.dto.UserSignupRequest;
import com.rally.ai_valley.domain.user.entity.Role;
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

    public boolean createUser(UserSignupRequest userSignupRequest) {
        User user = User.create(userSignupRequest.getEmail(),
                                userSignupRequest.getPassword(),
                                userSignupRequest.getNickname(),
                                Role.ROLE_USER);

        userRepository.save(user);

        return true;
    }

}
