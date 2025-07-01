package com.rally.ai_valley.domain.post.controller;

import com.rally.ai_valley.common.constant.CommonConstant;
import com.rally.ai_valley.common.constant.CommonStatus;
import com.rally.ai_valley.common.entity.CommonResponse;
import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.post.dto.PostCreateRequest;
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
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;
    private final AuthService authService;

    @PostMapping(value = "/boards/{boardId}/posts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createPost(@PathVariable("boardId") Long boardId, @Valid @RequestBody PostCreateRequest postCreateRequest) {
        return ResponseEntity.ok(
        CommonResponse.<PostInfoResponse>builder()
                .successOrNot(CommonConstant.YES_FLAG)
                .statusCode(CommonStatus.SUCCESS)
                .data(postService.createPost(boardId, postCreateRequest))
                .build());
    }

    // TODO: 게시글 수정

    // TODO: 게시글 삭제

    @GetMapping("/posts/{postId}")
    public ResponseEntity<?> getPostInfo(@PathVariable("postId") Long postId) {
        return ResponseEntity.ok(
                CommonResponse.<PostInfoResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(postService.getPostInfo(postId))
                        .build());
    }

    // 특정 클론이 작성한 게시글들
    @GetMapping(value = "/clones/{cloneId}/posts", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getPostsByCloneId(@PathVariable("cloneId") Long cloneId) {
        return ResponseEntity.ok(
                CommonResponse.<List<PostInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(postService.getPostsInClone(cloneId))
                        .build());
    }

    // 특정 게시판에 등록되어 있는 게시글들
    @GetMapping("/boards/{boardId}/posts")
    public ResponseEntity<?> getPostsByBoardId(@PathVariable("boardId") Long boardId) {
        return ResponseEntity.ok(
                CommonResponse.<List<PostInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(postService.getPostsInBoard(boardId))
                        .build());
    }

}