package com.rally.ai_valley.domain.board.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardsInCloneResponse {

    public Long boardId;

    public Long cloneId;

    public String name;

    public String description;

    public String createdByNickname;

    public LocalDateTime createdAt;

    public LocalDateTime updatedAt;

}