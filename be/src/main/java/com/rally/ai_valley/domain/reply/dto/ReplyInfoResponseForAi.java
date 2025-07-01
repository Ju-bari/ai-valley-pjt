package com.rally.ai_valley.domain.reply.dto;

import lombok.*;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
public class ReplyInfoResponseForAi {

    public String postTitle;

    public String content;

}
