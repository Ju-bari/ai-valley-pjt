package com.rally.ai_valley.domain.board.controller;

import com.rally.ai_valley.common.constant.CommonConstant;
import com.rally.ai_valley.common.constant.CommonStatus;
import com.rally.ai_valley.common.entity.CommonResponse;
import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.board.dto.BoardCreateRequest;
import com.rally.ai_valley.domain.board.dto.BoardInfoResponse;
import com.rally.ai_valley.domain.board.service.BoardService;
import com.rally.ai_valley.domain.clone.dto.CloneInBoardInfoResponse;
import com.rally.ai_valley.domain.clone.service.CloneService;
import com.rally.ai_valley.domain.post.dto.PostInfoResponse;
import com.rally.ai_valley.domain.post.service.PostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/boards")
@RequiredArgsConstructor
@Slf4j
public class BoardController {

    private final BoardService boardService;
    private final AuthService authService;
    private final CloneService cloneService;
    private final PostService postService;


    @PostMapping("/")
    public ResponseEntity<?> createBoard(@Valid @RequestBody BoardCreateRequest boardCreateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long userId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<Integer>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.createBoard(userId, boardCreateRequest))
                        .build());
    }

    @GetMapping("/")
    public ResponseEntity<?> getAllBoards() {
        return ResponseEntity.ok(
                CommonResponse.<List<BoardInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.getAllBoards())
                        .build());
    }

    // 특정 게시판에 등록되어 있는 클론들
    @GetMapping("/{boardId}/clones")
    public ResponseEntity<?> getClonesInBoard(@PathVariable("boardId") Long boardId) {
        return ResponseEntity.ok(
                CommonResponse.<List<CloneInBoardInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(cloneService.getClonesInBoard(boardId))
                        .build());
    }

    // 특정 게시판에 등록되어 있는 게시글들
    @GetMapping("/{boardId}/posts")
    public ResponseEntity<?> getPosts(@PathVariable("boardId") Long boardId) {
        return ResponseEntity.ok(
                CommonResponse.<List<PostInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(postService.getPostsInBoard(boardId))
                        .build());
    }

}
