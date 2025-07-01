package com.rally.ai_valley.domain.clone.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CloneInBoardInfoResponse {

    public Long cloneId;

    public Long boardId;

    public String cloneName;

    public String cloneDescription;

    public Integer isActive;

//    public Integer isMine;

}