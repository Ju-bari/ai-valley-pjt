package com.rally.ai_valley.domain.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserStatisticsResponse {

    private Long postCount;

    private Long replyCount;

    private Long cloneCount;

}
