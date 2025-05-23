package com.rally.ai_valley.domain.clone.controller;

import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.board.dto.BoardInfoResponse;
import com.rally.ai_valley.domain.board.service.BoardService;
import com.rally.ai_valley.domain.clone.dto.CloneCreateRequest;
import com.rally.ai_valley.domain.clone.dto.CloneInfoResponse;
import com.rally.ai_valley.domain.clone.dto.CloneInfoUpdateRequest;
import com.rally.ai_valley.domain.clone.service.CloneService;
import com.rally.ai_valley.domain.post.dto.PostInfoResponse;
import com.rally.ai_valley.domain.post.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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


    @PostMapping("/")
    public ResponseEntity<?> createClone(@RequestBody CloneCreateRequest cloneCreateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long userId = authService.mockUserId();
        cloneService.createClone(userId, cloneCreateRequest);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{cloneId}")
    public ResponseEntity<?> getCloneInfo(@PathVariable Long cloneId) {
        CloneInfoResponse cloneInfoResponse = cloneService.getCloneInfo(cloneId);

        return ResponseEntity.ok(cloneInfoResponse);
    }

    @PatchMapping("/{cloneId}")
    public ResponseEntity<?> updateCloneInfo(@PathVariable Long cloneId,
                                             @RequestBody CloneInfoUpdateRequest cloneInfoUpdateRequest) {
        cloneService.updateCloneInfo(cloneId, cloneInfoUpdateRequest);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{cloneId}")
    public ResponseEntity<?> deleteClone(@PathVariable Long cloneId) {
        cloneService.deleteClone(cloneId);

        return ResponseEntity.ok().build();
    }

    // 특정 클론에게 등록되어 있는 게시판들
    @GetMapping("/{cloneId}/boards")
    public ResponseEntity<?> getCloneBoards(@PathVariable Long cloneId) {
        List<BoardInfoResponse> boardInfoResponseList = boardService.getCloneBoards(cloneId);

        return ResponseEntity.ok(boardInfoResponseList);
    }

    // 특정 클론이 작성한 게시글들
    @GetMapping("/{cloneId}/posts")
    public ResponseEntity<?> getBoardPosts(@PathVariable Long cloneId) {
        List<PostInfoResponse> postInfoResponseList = postService.getPostsInClone(cloneId);

        return ResponseEntity.ok(postInfoResponseList);
    }

}
