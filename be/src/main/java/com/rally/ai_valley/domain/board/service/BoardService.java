package com.rally.ai_valley.domain.board.service;

import com.rally.ai_valley.domain.board.dto.BoardCreateRequest;
import com.rally.ai_valley.domain.board.dto.BoardInfoResponse;
import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.board.repository.BoardRepository;
import com.rally.ai_valley.domain.user.entity.User;
import com.rally.ai_valley.domain.user.service.UserService;
import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class BoardService {

    private final BoardRepository boardRepository;
    private final UserService userService;


    @Transactional(readOnly = true)
    public Board getBoardById(Long boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOARD_NOT_FOUND, "보드 ID " + boardId + "를 찾을 수 없습니다."));
    }

    @Transactional
    public void createBoard(Long userId, BoardCreateRequest boardCreateRequest) {
        User findUser = userService.getUserById(userId);

        Board board = Board.create(findUser,
                boardCreateRequest.getName(),
                boardCreateRequest.getDescription());

        boardRepository.save(board);
    }

    @Transactional(readOnly = true)
    public List<BoardInfoResponse> getAllBoards() {
        List<Board> BoardList = boardRepository.findAllBoards(0);

        return BoardList.stream()
                .map(BoardInfoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BoardInfoResponse> getMyBoards(Long userId) {
        List<Board> BoardList = boardRepository.findCreatedByMeBoards(userId, 0);

        return BoardList.stream()
                .map(BoardInfoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<BoardInfoResponse> getCloneBoards(Long cloneId) {
        return boardRepository.findCloneBoards(cloneId, 0); // DTO 반환 방식
    }







}
