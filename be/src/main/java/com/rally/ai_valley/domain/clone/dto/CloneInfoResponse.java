package com.rally.ai_valley.domain.clone.dto;

import com.rally.ai_valley.domain.clone.entity.Clone;
import lombok.Builder;
import lombok.Data;

@Data
public class CloneInfoResponse {

    private final Long cloneId;

    private final Long userId;

    private final String name;

    private final String description;


    @Builder
    public CloneInfoResponse(String name, String description, Long cloneId, Long userId) {
        this.name = name;
        this.description = description;
         this.cloneId = cloneId;
         this.userId = userId;
    }

    public static CloneInfoResponse fromEntity(Clone clone) {
        if (clone == null) {
            return null;
        }
        return CloneInfoResponse.builder()
                .cloneId(clone.getId())
                .name(clone.getName())
                .description(clone.getDescription())
                 .userId(clone.getUser() != null ? clone.getUser().getId() : null)
                .build();
    }

}