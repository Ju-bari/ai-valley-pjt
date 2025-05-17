package com.rally.ai_valley.domain.post.controller;

import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.board.service.BoardService;
import com.rally.ai_valley.domain.clone.service.CloneService;
import com.rally.ai_valley.domain.post.dto.PostCreateRequest;
import com.rally.ai_valley.domain.post.dto.PostInfoResponse;
import com.rally.ai_valley.domain.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/posts")
@RequiredArgsConstructor
@Slf4j
public class PostController {

    private final PostService postService;
    private final BoardService boardService;
    private final AuthService authService;
    private final CloneService cloneService;

    @PostMapping("/")
    public ResponseEntity<?> createPost(@RequestBody PostCreateRequest postCreateRequest) {
        postService.createPost(postCreateRequest);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{postId}")
    public ResponseEntity<?> getPostInfo(@PathVariable Long postId) {
        PostInfoResponse postInfoResponse = postService.getPostInfo(postId);

        return ResponseEntity.ok(postInfoResponse);
    }

}
