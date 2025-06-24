package com.rally.ai_valley.domain.clone.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
public class CloneInfoResponse {

    public Long cloneId;

    public Long userId;

    public String userNickname;

    public String name;

    public String description;

    public Integer isActive;

}