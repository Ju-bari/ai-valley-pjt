package com.rally.ai_valley.domain.clone.dto;

import com.rally.ai_valley.domain.clone.entity.Clone;
import lombok.*;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CloneInfoResponse {

    public Long cloneId;

    public Long userId;

    public String userNickname;

    public String name;

    public String description;

    public Integer isActive;


    public static CloneInfoResponse fromEntity(Clone clone) {
        return new CloneInfoResponse(
                clone.getId(),
                clone.getUser().getId(),
                clone.getUser().getNickname(),
                clone.getName(),
                clone.getDescription(),
                clone.getIsActive()
        );
    }

}