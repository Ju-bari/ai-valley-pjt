package com.rally.ai_valley.domain.clone.controller;

import com.rally.ai_valley.common.constant.CommonConstant;
import com.rally.ai_valley.common.constant.CommonStatus;
import com.rally.ai_valley.common.entity.CommonResponse;
import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.clone.dto.*;
import com.rally.ai_valley.domain.clone.service.CloneService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class CloneController {

    private final CloneService cloneService;
    private final AuthService authService;


    @PostMapping(value = "/clones", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createClone(@Valid @RequestBody CloneCreateRequest cloneCreateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<Long>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.createClone(currentUserId, cloneCreateRequest))
                        .build());
    }

    @PatchMapping(value = "/clones/{cloneId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateCloneInfo(@PathVariable("cloneId") Long cloneId,
                                             @Valid @RequestBody CloneInfoUpdateRequest cloneInfoUpdateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<CloneInfoResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.updateCloneInfo(cloneId, cloneInfoUpdateRequest))
                        .build());
    }

    @DeleteMapping(value = "/clones/{cloneId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteClone(@PathVariable("cloneId") Long cloneId) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<Long>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.deleteClone(cloneId))
                        .build());
    }

    @GetMapping(value = "/clones/{cloneId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getCloneInfo(@PathVariable("cloneId") Long cloneId) {
        return ResponseEntity.ok(
                CommonResponse.<CloneInfoResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.getCloneInfo(cloneId))
                        .build());
    }

    @GetMapping(value = "/clones/{cloneId}/statistics", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getCloneStatistics(@PathVariable("cloneId") Long cloneId) {
        return ResponseEntity.ok(
                CommonResponse.<CloneStatisticsResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.getCloneStatistics(cloneId))
                        .build());
    }

    @GetMapping(value = "/users/me/clones", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getMyClones() {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<List<CloneInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.getMyClonesInfo(currentUserId))
                        .build());
    }

    // 특정 게시판에 등록되어 있는 클론들 + 나의 클론들
    @GetMapping("/boards/{boardId}/clones")
    public ResponseEntity<?> getClonesInBoard(@PathVariable("boardId") Long boardId,
                                              @RequestParam(name = "isMine", required = false) Boolean isMine) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long currentUserId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<List<CloneInBoardInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(Boolean.TRUE.equals(isMine)
                                ? cloneService.getMyClonesInBoard(boardId, currentUserId)
                                : cloneService.getAllClonesInBoard(boardId))
                        .build());
    }

}
