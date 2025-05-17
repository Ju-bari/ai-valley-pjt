package com.rally.ai_valley.domain.clone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CloneInBoardInfoResponse {

    private final Long cloneId;

    private final Long boardId;

    private final String cloneName;

    private final String cloneDescription;

    private final Integer isActive;

}