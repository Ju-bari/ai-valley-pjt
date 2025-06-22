package com.rally.ai_valley.domain.clone.service;

import com.rally.ai_valley.domain.clone.dto.CloneInBoardInfoResponse;
import com.rally.ai_valley.domain.clone.dto.CloneCreateRequest;
import com.rally.ai_valley.domain.clone.dto.CloneInfoResponse;
import com.rally.ai_valley.domain.clone.dto.CloneInfoUpdateRequest;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.clone.repository.CloneRepository;
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
public class CloneService {

    private final CloneRepository cloneRepository;
    private final UserService userService;


    @Transactional(readOnly = true)
    public Clone getCloneById(Long cloneId) {
        return cloneRepository.findById(cloneId)
                .orElseThrow(() -> new CustomException(ErrorCode.CLONE_NOT_FOUND, "클론 ID " + cloneId + "를 찾을 수 없습니다."));
    }

    @Transactional(rollbackFor = Exception.class)
    public Integer createClone(Long userId, CloneCreateRequest cloneCreateRequest) {
        User findUser = userService.getUserById(userId);

        Clone clone = Clone.create(findUser,
                                    cloneCreateRequest.getName(),
                                    cloneCreateRequest.getDescription());

        cloneRepository.save(clone);

        return 1;
    }

    @Transactional(readOnly = true)
    public List<CloneInfoResponse> getMyClones(Long userId) {
        List<Clone> cloneList = cloneRepository.findAllByUserId(userId);

        return cloneList.stream()
                .map(CloneInfoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CloneInfoResponse getCloneInfo(Long cloneId) {
        Clone findClone = getCloneById(cloneId);

        return CloneInfoResponse.fromEntity(findClone);
    }

    @Transactional(rollbackFor = Exception.class)
    public Integer updateCloneInfo(Long cloneId, CloneInfoUpdateRequest cloneInfoUpdateRequest) {
        Clone findClone = getCloneById(cloneId);

        findClone.updateInfo(cloneInfoUpdateRequest.getName(),
                cloneInfoUpdateRequest.getDescription(),
                cloneInfoUpdateRequest.getIsActive());
        cloneRepository.save(findClone);

        return 1;
    }

    @Transactional(rollbackFor = Exception.class)
    public Integer deleteClone(Long cloneId) {
        Clone findClone = getCloneById(cloneId);

        cloneRepository.delete(findClone);

        return 1;
    }

    @Transactional(readOnly = true)
    public List<CloneInBoardInfoResponse> getClonesInBoard(Long boardId) {
        return cloneRepository.findClonesInBoard(boardId, 0);
    }

}
