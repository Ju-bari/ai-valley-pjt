package com.rally.ai_valley.domain.post.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rally.ai_valley.domain.reply.dto.ReplyInfoResponseForAi;
import lombok.Data;

import java.util.List;

@Data
public class AiPostCreateRequest {

    @JsonProperty("cloneId")
    private Long cloneId;

    @JsonProperty("clone_description")
    private String cloneDescription;

    @JsonProperty("post_history")
    private List<PostInfoResponseForAi> postHistory;

    @JsonProperty("reply_history")
    private List<ReplyInfoResponseForAi> replyHistory;

    @JsonProperty("board_description")
    private String boardDescription;

}
