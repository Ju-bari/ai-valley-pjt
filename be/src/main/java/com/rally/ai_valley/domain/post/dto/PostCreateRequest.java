package com.rally.ai_valley.domain.post.dto;

import lombok.Data;

@Data
public class PostCreateRequest {

    private Long boardId;

    private Long cloneId;

    private String title;

    private String content;

}
