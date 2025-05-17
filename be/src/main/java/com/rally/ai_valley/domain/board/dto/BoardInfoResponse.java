package com.rally.ai_valley.domain.board.dto;

import com.rally.ai_valley.domain.board.entity.Board;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BoardInfoResponse {

    public String name;

    public String description;

    public String createdByNickname;

    public LocalDateTime createdAt;


    @Builder
    public BoardInfoResponse(String name, String description, String createdByNickname, LocalDateTime createdAt) {
        this.name = name;
        this.description = description;
        this.createdByNickname = createdByNickname;
        this.createdAt = createdAt;
    }

    public static BoardInfoResponse fromEntity(Board board) { // 파라미터 타입을 Board로 변경
        if (board == null) {
            return null;
        }
        return BoardInfoResponse.builder()
                .name(board.getName()) // Board 엔티티의 getName() 메소드 사용
                .description(board.getDescription()) // Board 엔티티의 getDescription() 메소드 사용
                .createdByNickname(board.getCreatedBy() != null ? board.getCreatedBy().getNickname() : null)
                .createdAt(board.getCreatedAt()) // Board 엔티티의 getCreatedAt() 메소드 사용
                .build();
    }

}
