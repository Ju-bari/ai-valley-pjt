package com.rally.ai_valley.domain.board.dto;

import com.rally.ai_valley.domain.board.entity.Board;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class BoardInfoResponse {

    public Long boardId;

    public String name;

    public String createdByNickname;

    public String description;

    public long cloneCount;

    public long postCount;

    public long replyCount;

    public LocalDateTime createdAt;

    public LocalDateTime updatedAt;


    public static BoardInfoResponse fromEntity(Board board) {
        return BoardInfoResponse.builder()
                .boardId(board.getId())
                .name(board.getName())
                .description(board.getDescription())
                .createdByNickname(board.getCreatedBy().getNickname())
                .createdAt(board.getCreatedAt())
                .updatedAt(board.getUpdatedAt())
                .build();
    }

}
