package com.rally.ai_valley.domain.clone.service;

import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.board.repository.BoardRepository;
import com.rally.ai_valley.domain.board.service.BoardService;
import com.rally.ai_valley.domain.board.dto.BoardSubscriptionRequest;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.clone.entity.CloneBoard;
import com.rally.ai_valley.domain.clone.repository.CloneBoardRepository;
import com.rally.ai_valley.domain.clone.repository.CloneRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloneBoardService {

    private final BoardService boardService;
    private final CloneBoardRepository cloneBoardRepository;
    private final CloneRepository cloneRepository;
    private final BoardRepository boardRepository;

    // 순한 참조 문제
    @Transactional(rollbackFor = Exception.class)
    public Integer addCloneToBoard(Long boardId, BoardSubscriptionRequest boardSubscriptionRequest) {
        Long cloneId = boardSubscriptionRequest.getCloneId();

        Optional<CloneBoard> optionalCloneBoard = cloneBoardRepository.findCloneBoardByCloneIdAndBoardId(boardId, cloneId);
//        log.info("구독 시도 되었습니다 {} -> {}", cloneId, boardId);

        if (optionalCloneBoard.isPresent()) {
            // 데이터가 이미 존재하는 경우
            CloneBoard existingCloneBoard = optionalCloneBoard.get();
            if (existingCloneBoard.getIsActive() == 1) {
                // 이미 활성화 상태라면, 예외 처리
                throw new IllegalStateException("이미 보드에 추가된 클론입니다.");
            } else {
                // 비활성화(soft-deleted) 상태라면, 다시 활성화(reactivate)
                existingCloneBoard.reactivate();
            }
        } else {
            // 데이터가 아예 존재하지 않는 경우
            Clone findClone = cloneRepository.findById(cloneId)
                    .orElseThrow(() -> new CustomException(ErrorCode.CLONE_NOT_FOUND)); // 순한 참조 방지를 위해 repository 직접 호출
            Board findBoard = boardRepository.findBoardById(boardId)
                    .orElseThrow(() -> new CustomException(ErrorCode.BOARD_NOT_FOUND));


            CloneBoard cloneBoard = CloneBoard.create(findClone, findBoard);
            cloneBoardRepository.save(cloneBoard);
        }

        return 1;
    }

    @Transactional(rollbackFor = Exception.class)
    public Integer removeCloneFromBoard(Long boardId, BoardSubscriptionRequest boardSubscriptionRequest) {
        CloneBoard findCloneBoard = cloneBoardRepository
                .findCloneBoardByCloneIdAndBoardId(boardId, boardSubscriptionRequest.getCloneId())
                .orElseThrow(() -> new IllegalArgumentException("해당 클론-보드 관계를 찾을 수 없습니다."));

        findCloneBoard.softDelete();

        return 1;
    }

}
