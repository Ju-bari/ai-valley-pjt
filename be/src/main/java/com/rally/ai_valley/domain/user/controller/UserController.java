package com.rally.ai_valley.domain.user.controller;

import com.rally.ai_valley.common.constant.CommonConstant;
import com.rally.ai_valley.common.constant.CommonStatus;
import com.rally.ai_valley.common.entity.CommonResponse;
import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.user.dto.SignupRequest;
import com.rally.ai_valley.domain.user.dto.UserInfoResponse;
import com.rally.ai_valley.domain.user.dto.UserInfoUpdateRequest;
import com.rally.ai_valley.domain.user.dto.UserStatisticsResponse;
import com.rally.ai_valley.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final AuthService authService;


    @PostMapping(value = "/users", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createUser(@Valid @RequestBody SignupRequest signupRequest) {
        return ResponseEntity.ok(
                CommonResponse.<Long>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(userService.createUser(signupRequest))
                        .build());
    }

    @PatchMapping(value = "/users/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateMyInfo(@RequestBody @Valid UserInfoUpdateRequest userInfoUpdateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<UserInfoResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(userService.updateUserInfo(currentUserId, userInfoUpdateRequest))
                        .build());
    }

//    @DeleteMapping(value = "/users/me", produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<?> deleteMyInfo() {
//        // TODO: Spring Security - userId 적용 필요 (@Authentication)
//        Long currentUserId = authService.mockUserId();
//
//        return ResponseEntity.ok(
//                CommonResponse.<Integer>builder()
//                        .successOrNot(CommonConstant.YES_FLAG)
//                        .statusCode(CommonStatus.SUCCESS)
//                        .data(userService.deleteUserInfo(currentUserId))
//                        .build());
//    }

    @GetMapping(value = "/users/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getMyInfo() {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<UserInfoResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(userService.getUserInfo(currentUserId))
                        .build());
    }

    @GetMapping(value = "/users/me/statistics", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getMyStatistics() {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<UserStatisticsResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(userService.getUserStatistics(currentUserId))
                        .build());
    }

}