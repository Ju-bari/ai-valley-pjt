package com.rally.ai_valley.domain.board.controller;

import com.rally.ai_valley.common.constant.CommonConstant;
import com.rally.ai_valley.common.constant.CommonStatus;
import com.rally.ai_valley.common.entity.CommonResponse;
import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.board.dto.BoardCreateRequest;
import com.rally.ai_valley.domain.board.dto.BoardInfoResponse;
import com.rally.ai_valley.domain.board.dto.BoardSubscriptionRequest;
import com.rally.ai_valley.domain.board.dto.BoardsInCloneResponse;
import com.rally.ai_valley.domain.board.service.BoardService;
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
public class BoardController {

    private final BoardService boardService;
    private final AuthService authService;


    @PostMapping("/boards")
    public ResponseEntity<?> createBoard(@Valid @RequestBody BoardCreateRequest boardCreateRequest) {
        // TODO: Spring Security - userId 적용 필요 (@Authentication)
        Long userId = authService.mockUserId();

        return ResponseEntity.ok(
                CommonResponse.<Long>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.createBoard(userId, boardCreateRequest))
                        .build());
    }

    // TODO: Board 수정

    // TODO: Board 삭제

    @GetMapping("/boards")
    public ResponseEntity<?> getAllBoardsInfo() {
        return ResponseEntity.ok(
                CommonResponse.<List<BoardInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.getAllBoardsInfo())
                        .build());
    }

    @GetMapping("/boards/{boardId}")
    public ResponseEntity<?> getBoardById(@PathVariable("boardId") Long boardId) {
        return ResponseEntity.ok(
                CommonResponse.<BoardInfoResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.getBoardInfo(boardId))
                        .build());
    }

    @GetMapping(value = "/users/me/boards", produces = MediaType.APPLICATION_JSON_VALUE)
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

    // 특정 클론에게 등록되어 있는 게시판들
    @GetMapping(value = "/clones/{cloneId}/boards", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getBoardsInClone(@PathVariable("cloneId") Long cloneId) {
        return ResponseEntity.ok(
                CommonResponse.<List<BoardsInCloneResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.getBoardsInClone(cloneId))
                        .build());
    }

    // 특정 클론이 게시판 구독하기
    @PostMapping(value = "/boards/{boardId}/subscriptions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> addCloneToBoard(@PathVariable("boardId") Long boardId,
                                             @Valid @RequestBody BoardSubscriptionRequest boardSubscriptionRequest) {
        return ResponseEntity.ok(
                CommonResponse.<Integer>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.addCloneToBoard(boardId, boardSubscriptionRequest))
                        .build());
    }

    // 특정 클론이 게시판 구독 취소하기
    @DeleteMapping(value = "/boards/{boardId}/subscriptions", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> removeCloneFromBoard(@PathVariable("boardId") Long boardId,
                                                  @Valid @RequestBody BoardSubscriptionRequest boardSubscriptionRequest) {
        return ResponseEntity.ok(
                CommonResponse.<Integer>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(boardService.removeCloneFromBoard(boardId, boardSubscriptionRequest))
                        .build());
    }

}
