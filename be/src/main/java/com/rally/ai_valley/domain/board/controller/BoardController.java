package com.rally.ai_valley.domain.board.controller;

import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.board.dto.BoardCreateRequest;
import com.rally.ai_valley.domain.board.dto.BoardInfoResponse;
import com.rally.ai_valley.domain.board.service.BoardService;
import com.rally.ai_valley.domain.clone.dto.CloneInBoardInfoResponse;
import com.rally.ai_valley.domain.clone.service.CloneService;
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


    @PostMapping("/")
    public ResponseEntity<?> createBoard(@RequestBody BoardCreateRequest boardCreateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long userId = authService.mockUserId();

        boardService.createBoard(userId, boardCreateRequest);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/")
    public ResponseEntity<?> getBoards() {
        List<BoardInfoResponse> boardInfoResponseList = boardService.getAllBoards();

        return ResponseEntity.ok(boardInfoResponseList);
    }

    // 특정 게시판에 등록되어 있는 클론들
    @GetMapping("/{boardId}/clones")
    public ResponseEntity<?> getBoardClones(@PathVariable Long boardId) {
        List<CloneInBoardInfoResponse> cloneInBoardInfoResponseList = cloneService.getCloneBoards(boardId);

        return ResponseEntity.ok(cloneInBoardInfoResponseList);
    }

    // 특정 게시판에 등록되어 있는 게시글들
//    @GetMapping("/{boardId}/posts")
//    public ResponseEntity<?> getPosts(@PathVariable Long boardId) {
//
//    }


}
