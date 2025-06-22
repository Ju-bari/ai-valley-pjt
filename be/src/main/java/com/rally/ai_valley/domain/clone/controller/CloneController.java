package com.rally.ai_valley.domain.clone.controller;

import com.rally.ai_valley.common.constant.CommonConstant;
import com.rally.ai_valley.common.constant.CommonStatus;
import com.rally.ai_valley.common.entity.CommonResponse;
import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.board.dto.BoardInfoResponse;
import com.rally.ai_valley.domain.board.service.BoardService;
import com.rally.ai_valley.domain.clone.dto.CloneCreateRequest;
import com.rally.ai_valley.domain.clone.dto.CloneInfoResponse;
import com.rally.ai_valley.domain.clone.dto.CloneInfoUpdateRequest;
import com.rally.ai_valley.domain.clone.dto.CloneSubBoardRequest;
import com.rally.ai_valley.domain.clone.service.CloneService;
import com.rally.ai_valley.domain.post.dto.PostInfoResponse;
import com.rally.ai_valley.domain.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clones")
@RequiredArgsConstructor
@Slf4j
public class CloneController {

    private final CloneService cloneService;
    private final AuthService authService;
    private final BoardService boardService;
    private final PostService postService;


    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createClone(@Valid @RequestBody CloneCreateRequest cloneCreateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long userId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<Integer>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.createClone(userId, cloneCreateRequest))
                        .build());
    }

    @GetMapping(value = "/{cloneId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getCloneInfo(@PathVariable("cloneId") Long cloneId) {
        return ResponseEntity.ok(
                CommonResponse.<CloneInfoResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.getCloneInfo(cloneId))
                        .build());
    }

    @PatchMapping(value = "/{cloneId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> updateCloneInfo(@PathVariable("cloneId") Long cloneId,
                                             @Valid @RequestBody CloneInfoUpdateRequest cloneInfoUpdateRequest) {
        return ResponseEntity.ok(
                CommonResponse.<Integer>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.updateCloneInfo(cloneId, cloneInfoUpdateRequest))
                        .build());
    }

    @DeleteMapping(value = "/{cloneId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> deleteClone(@PathVariable("cloneId") Long cloneId) {
        return ResponseEntity.ok(
                CommonResponse.<Integer>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.deleteClone(cloneId))
                        .build());
    }

    // 특정 클론에게 등록되어 있는 게시판들
    @GetMapping(value = "/{cloneId}/boards", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getCloneBoards(@PathVariable("cloneId") Long cloneId) {
        return ResponseEntity.ok(
                CommonResponse.<List<BoardInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.getBoardsInClone(cloneId))
                        .build());
    }

    // 특정 클론이 작성한 게시글들
    @GetMapping(value = "/{cloneId}/posts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBoardPosts(@PathVariable("cloneId") Long cloneId) {
        return ResponseEntity.ok(
                CommonResponse.<List<PostInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(postService.getPostsInClone(cloneId))
                        .build());
    }

    @GetMapping(value = "/{cloneId}/boards", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBoardPosts(@PathVariable("cloneId") Long cloneId,
                                           @Valid @RequestBody CloneSubBoardRequest cloneSubBoardRequest) {
        return ResponseEntity.ok(
                CommonResponse.<Integer>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.subscribeBoard(cloneSubBoardRequest.getBoardId()))
                        .build());
    }

}
