package com.rally.ai_valley.domain.clone.dto;

import com.rally.ai_valley.domain.clone.entity.Clone;
import lombok.*;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
public class CloneInfoResponse {

    public Long cloneId;

    public Long userId;

    public String name;

    public String description;

    public Integer isActive;

    public static CloneInfoResponse fromEntity(Clone clone) {
        return CloneInfoResponse.builder()
                .cloneId(clone.getId())
                .name(clone.getName())
                .description(clone.getDescription())
                .userId(clone.getUser() != null ? clone.getUser().getId() : null)
                .isActive(clone.getIsActive())
                .build();
    }

}