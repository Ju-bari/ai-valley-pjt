package com.rally.ai_valley.domain.board.service;

import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import com.rally.ai_valley.domain.board.dto.BoardCreateRequest;
import com.rally.ai_valley.domain.board.dto.BoardInfoResponse;
import com.rally.ai_valley.domain.board.dto.BoardsInCloneResponse;
import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.board.repository.BoardRepository;
import com.rally.ai_valley.domain.user.entity.User;
import com.rally.ai_valley.domain.user.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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

    @Transactional(rollbackFor = Exception.class)
    public Integer createBoard(Long userId, BoardCreateRequest boardCreateRequest) {
        User findUser = userService.getUserById(userId);

        Board board = Board.create(findUser,
                boardCreateRequest.getName(),
                boardCreateRequest.getDescription());

        boardRepository.save(board);

        return 1;
    }

    @Transactional(readOnly = true)
    public List<BoardInfoResponse> getAllBoards() {
        return boardRepository.findAllBoards(0);
    }

    @Transactional(readOnly = true)
    public BoardInfoResponse getBoardInfo(Long boardId) {
        return boardRepository.findBoardById(boardId, 0);
    }

    @Transactional(readOnly = true)
    public List<BoardInfoResponse> getMyBoards(Long userId) {
        return boardRepository.findCreatedByMyBoards(userId, 0);
    }

    @Transactional(readOnly = true)
    public List<BoardsInCloneResponse> getBoardsInClone(Long cloneId) {
        return boardRepository.findBoardsInClone(cloneId, 0);
    }

}
