package com.rally.ai_valley.domain.user.controller;

import com.rally.ai_valley.common.constant.CommonConstant;
import com.rally.ai_valley.common.constant.CommonStatus;
import com.rally.ai_valley.common.entity.CommonResponse;
import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.board.dto.BoardInfoResponse;
import com.rally.ai_valley.domain.board.service.BoardService;
import com.rally.ai_valley.domain.clone.dto.CloneInfoResponse;
import com.rally.ai_valley.domain.clone.service.CloneService;
import com.rally.ai_valley.domain.user.dto.SignupRequest;
import com.rally.ai_valley.domain.user.dto.UserInfoResponse;
import com.rally.ai_valley.domain.user.dto.UserInfoUpdateRequest;
import com.rally.ai_valley.domain.user.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final AuthService authService;
    private final CloneService cloneService;
    private final BoardService boardService;


    @PostMapping(value = "/signup", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> signup(@RequestBody SignupRequest signupRequest) {
        return ResponseEntity.ok(
                CommonResponse.<Integer>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(userService.createUser(signupRequest))
                        .build());
    }

    @GetMapping(value = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
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

    @PatchMapping(value = "/me", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateMyInfo(@RequestBody @Valid UserInfoUpdateRequest userInfoUpdateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<Integer>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(userService.updateUserInfo(currentUserId, userInfoUpdateRequest))
                        .build());
    }

    @GetMapping(value = "/me/clones", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getMyClones() {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<List<CloneInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.getMyClones(currentUserId))
                        .build());
    }

    @GetMapping(value = "/me/boards", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getMyBoards() {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<List<BoardInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.getMyBoards(currentUserId))
                        .build());
    }

}
