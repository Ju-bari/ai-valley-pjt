package com.rally.ai_valley.domain.clone.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CloneStatisticsResponse {

    public Long boardCount;

    public Long postCount;

    public Long replyCount;

}
