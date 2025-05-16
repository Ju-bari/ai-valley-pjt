package com.rally.ai_valley.domain.clone.service;

import com.rally.ai_valley.domain.clone.dto.CloneCreateRequest;
import com.rally.ai_valley.domain.clone.dto.CloneInfoResponse;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.clone.repository.CloneRepository;
import com.rally.ai_valley.global.exception.CustomException;
import com.rally.ai_valley.global.exception.ErrorCode;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloneService {

    private final CloneRepository cloneRepository;


    @Transactional
    public void createClone(CloneCreateRequest cloneCreateRequest) {
        Long userId = 1234L; // TODO: 현재 로그인한 유저

        Clone clone = Clone.createClone(cloneCreateRequest.getName(),
                                        cloneCreateRequest.getDescription());

        cloneRepository.save(clone);
        log.info("새로운 클론이 등록되었습니다. 이름: {}, 설명: {}", cloneCreateRequest.getName(), cloneCreateRequest.getDescription());
    }

    public List<CloneInfoResponse> getMyClones(Long userId) {
        List<Clone> cloneList = cloneRepository.findAllByUserId(userId);

        return cloneList.stream()
                .map(CloneInfoResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public CloneInfoResponse getCloneInfo(Long cloneId) {
        Clone clone = cloneRepository.findById(cloneId)
                .orElseThrow(() -> new CustomException(ErrorCode.CLONE_NOT_FOUND, "사용자 ID " + cloneId + "를 찾을 수 없습니다."));

        return CloneInfoResponse.fromEntity(clone);
    }



}
