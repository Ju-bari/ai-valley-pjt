package com.rally.ai_valley.domain.clone.service;

import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import com.rally.ai_valley.domain.board.dto.BoardSubscriptionRequest;
import com.rally.ai_valley.domain.clone.dto.*;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.clone.repository.CloneRepository;
import com.rally.ai_valley.domain.user.entity.User;
import com.rally.ai_valley.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloneService {

    private final CloneRepository cloneRepository;
    private final UserRepository userRepository;
    private final CloneBoardService cloneBoardService;


    private Clone getCloneById(Long cloneId) {
        return cloneRepository.findCloneById(cloneId)
                .orElseThrow(() -> new CustomException(ErrorCode.CLONE_NOT_FOUND));
    }

    // 아이디 받아오는 로직
    @Transactional(rollbackFor = Exception.class)
    public Long createClone(Long userId, CloneCreateRequest cloneCreateRequest) {
        User findUser = userRepository.findUserById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        Clone createClone = Clone.create(findUser,
                cloneCreateRequest.getName(),
                cloneCreateRequest.getDescription());

        cloneRepository.save(createClone);
        Long cloneId = createClone.getId();

        // 보드 연결 처리
        if (cloneCreateRequest.getBoardIds() != null && !cloneCreateRequest.getBoardIds().isEmpty()) {
            for (Long boardId : cloneCreateRequest.getBoardIds()) {
                BoardSubscriptionRequest addRequest = new BoardSubscriptionRequest();
                addRequest.setCloneId(cloneId);
                cloneBoardService.addCloneToBoard(boardId, addRequest); // TODO: 리스트로 받아서 DB 호출을 줄이는 방법 필요
            }
        }

        return createClone.getId();
    }

    @Transactional(readOnly = true)
    public List<CloneInfoResponse> getMyClonesInfo(Long userId) {
        return cloneRepository.findAllClonesByUserId(userId);
    }

    @Transactional(readOnly = true)
    public CloneInfoResponse getCloneInfo(Long cloneId) {
        return cloneRepository.findCloneByCloneId(cloneId);
    }

    @Transactional(rollbackFor = Exception.class)
    public CloneInfoResponse updateCloneInfo(Long cloneId, CloneInfoUpdateRequest cloneInfoUpdateRequest) {
        Clone findClone = getCloneById(cloneId);

        findClone.updateInfo(cloneInfoUpdateRequest.getName(),
                cloneInfoUpdateRequest.getDescription(),
                cloneInfoUpdateRequest.getIsActive());

        return CloneInfoResponse.fromEntity(findClone);
    }

    @Transactional(rollbackFor = Exception.class)
    public Long deleteClone(Long cloneId) {
        Clone findClone = getCloneById(cloneId);

        cloneRepository.delete(findClone);

        return findClone.getId();
    }

    @Transactional(readOnly = true)
    public CloneStatisticsResponse getCloneStatistics(Long cloneId) {
        return cloneRepository.findUserStatisticsByCloneId(cloneId);
    }

    @Transactional(readOnly = true)
    public List<CloneInBoardInfoResponse> getAllClonesInBoard(Long boardId) {
        return cloneRepository.findAllClonesInBoard(boardId);
    }

    @Transactional(readOnly = true)
    public List<CloneInBoardInfoResponse> getMyClonesInBoard(Long boardId, Long userId) {
        return cloneRepository.findMyClonesInBoard(boardId, userId);
    }

}
