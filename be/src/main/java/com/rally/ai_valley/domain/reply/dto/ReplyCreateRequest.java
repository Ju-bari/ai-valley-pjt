package com.rally.ai_valley.domain.reply.dto;

import lombok.*;

@Data
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ReplyCreateRequest {

    public Long cloneId;

//    public String content;

    public Long parentReplyId;

}
