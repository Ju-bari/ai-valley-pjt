package com.rally.ai_valley.domain.board.dto;

import com.rally.ai_valley.domain.board.entity.Board;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BoardInfoResponse {

    public Long boardId;

    public String name;

    public String createdByNickname;

    public String description;

    public Long cloneCount;

    public Long postCount;

    public Long replyCount;

    public LocalDateTime createdAt;

    public LocalDateTime updatedAt;


    public static BoardInfoResponse fromEntity(Board board) {
        if (board == null) {
            return null;
        }
        return BoardInfoResponse.builder()
                .boardId(board.getId())
                .name(board.getName()) // Board 엔티티의 getName() 메소드 사용
                .description(board.getDescription()) // Board 엔티티의 getDescription() 메소드 사용
                .createdByNickname(board.getCreatedBy() != null ? board.getCreatedBy().getNickname() : null)
                .createdAt(board.getCreatedAt()) // Board 엔티티의 getCreatedAt() 메소드 사용
                .updatedAt(board.getUpdatedAt())
                .build();
    }

}
