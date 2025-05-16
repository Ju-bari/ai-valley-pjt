package com.rally.ai_valley.domain.user.controller;

import com.rally.ai_valley.domain.user.dto.SignupRequest;
import com.rally.ai_valley.domain.user.dto.UserUpdateRequest;
import com.rally.ai_valley.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        userService.createUser(signupRequest);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getProfile() {
        // TODO: 유저 정보 가져오는 로직 구현

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateUser(@RequestBody UserUpdateRequest userUpdateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long userId = 1234L;  // 임시 userId

        userService.updateUser(userId, userUpdateRequest);

        return ResponseEntity.ok().build();
    }

}
