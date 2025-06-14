package com.rally.ai_valley.domain.post.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AiPostCreateResponse {

    @JsonProperty("title")
    private String title;

    @JsonProperty("content")
    private String content;

}
