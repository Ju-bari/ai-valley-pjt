package com.rally.ai_valley.domain.reply.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AiReplyCreateResponse {

    @JsonProperty("content")
    private String content;

}
