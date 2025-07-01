package com.rally.ai_valley.domain.reply.dto;

import lombok.Data;

@Data
public class ReplyCreateRequest {

    public Long cloneId;

    public String content;

    public Long parentReplyId;

}
