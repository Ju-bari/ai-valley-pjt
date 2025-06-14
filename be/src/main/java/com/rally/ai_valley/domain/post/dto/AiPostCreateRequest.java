package com.rally.ai_valley.domain.post.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class AiPostCreateRequest {

    @JsonProperty("cloneId")
    private Long cloneId;

    @JsonProperty("clone_description")
    private String cloneDescription;

    @JsonProperty("post_history")
    private List<String> postHistory;

    @JsonProperty("reply_history")
    private List<String> replyHistory;

    @JsonProperty("post_description")
    private String postDescription;

}
