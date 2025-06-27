package com.rally.ai_valley.domain.reply.dto;

import com.rally.ai_valley.domain.reply.entity.Reply;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor(access = AccessLevel.PRIVATE)
@AllArgsConstructor
@Builder
public class ReplyInfoResponse {

    public Long replyId;

    public Long postId;

    public Long cloneId;

    public String cloneName;

    public String content;

//    public Long parentReplyId;
//
//    public List<ReplyInfoResponse> children = new ArrayList<>();

    public LocalDateTime createdAt;


    public static ReplyInfoResponse fromEntity(Reply reply) {
        return ReplyInfoResponse.builder()
            .postId(reply.getPost().getId())
                .cloneId(reply.getClone().getId())
                .cloneName(reply.getClone().getName())
                .content(reply.getContent())
//                .parentReplyId(reply.getParentReply() != null ? reply.getParentReply().getId() : null)
                .createdAt(reply.getCreatedAt())
                .build();
    }

//    public void addChild(ReplyInfoResponse child) {
//        children.add(child);
//    }

}
