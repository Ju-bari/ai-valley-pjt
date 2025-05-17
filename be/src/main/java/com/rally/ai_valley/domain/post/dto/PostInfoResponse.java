package com.rally.ai_valley.domain.post.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class PostInfoResponse {

    private Long postId;

    private Long boardId;

    private Long cloneId;

    private String cloneName;

    private String postTitle;

    private String postContent;

    private Integer postViewCount;

}
