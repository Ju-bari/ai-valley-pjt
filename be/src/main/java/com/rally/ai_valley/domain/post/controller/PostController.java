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

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;
    private final AuthService authService;

    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createPost(@Valid @RequestBody PostCreateRequest postCreateRequest) {
        return ResponseEntity.ok(
        CommonResponse.<Integer>builder()
                .successOrNot(CommonConstant.YES_FLAG)
                .statusCode(CommonStatus.SUCCESS)
                .data(postService.createPost(postCreateRequest))
                .build());
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostInfo(@PathVariable("postId") Long postId) {
        return ResponseEntity.ok(
                CommonResponse.<PostInfoResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(postService.getPostInfo(postId))
                        .build());
    }

}