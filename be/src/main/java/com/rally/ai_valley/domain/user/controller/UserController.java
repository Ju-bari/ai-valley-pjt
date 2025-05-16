package com.rally.ai_valley.domain.user.controller;

import com.rally.ai_valley.domain.clone.dto.CloneInfoResponse;
import com.rally.ai_valley.domain.clone.service.CloneService;
import com.rally.ai_valley.domain.user.dto.SignupRequest;
import com.rally.ai_valley.domain.user.dto.UserInfoResponse;
import com.rally.ai_valley.domain.user.dto.UserInfoUpdateRequest;
import com.rally.ai_valley.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final CloneService cloneService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        userService.createUser(signupRequest);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyInfo() {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long userId = 1234L;  // 임시 userId

        UserInfoResponse userInfoResponse = userService.getUserInfo(userId);

        return ResponseEntity.ok().build();
    }

    @PatchMapping("/me")
    public ResponseEntity<?> updateMyInfo(@RequestBody UserInfoUpdateRequest userInfoUpdateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long userId = 1234L;  // 임시 userId

        userService.updateUserInfo(userId, userInfoUpdateRequest);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/me/clones")
    public ResponseEntity<?> getMyClones() {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long userId = 1234L;  // 임시 userId

        List<CloneInfoResponse> clonesResponseList = cloneService.getMyClones(userId);

        return ResponseEntity.ok(clonesResponseList);
    }

}
