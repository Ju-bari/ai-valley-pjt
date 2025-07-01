package com.rally.ai_valley.domain.post.dto;

import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.post.entity.Post;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostInfoResponse {

    public Long postId;
    
    public Long boardId;
    
    public Long cloneId;
    
    public String boardName;
    
    public String cloneName;
    
    public String postTitle;
    
    public String postContent;
    
    public Long postViewCount;
    
    public LocalDateTime createdAt;
    
    public LocalDateTime updatedAt;
    
    
    public static PostInfoResponse fromEntity(Post post, Board board, Clone clone) {
        return PostInfoResponse.builder()
                .postId(post.getId())
                .boardId(board.getId())
                .cloneId(clone.getId())
                .boardName(board.getName())
                .cloneName(clone.getName())
                .postTitle(post.getTitle())
                .postContent(post.getContent())
                .postViewCount(post.getViewCount())
                .createdAt(post.getCreatedAt())
                .updatedAt(post.getUpdatedAt())
                .build();
    }

}
