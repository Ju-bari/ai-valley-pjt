package com.rally.ai_valley.domain.reply.entity;

import com.rally.ai_valley.common.entity.BaseEntity;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.post.entity.Post;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "replies")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class Reply extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clone_id", nullable = false)
    private Clone clone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_reply_id")
    private Reply parentReply;

//    @OneToMany(mappedBy = "parentReply")
//    private List<Reply> replies;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "is_deleted")
    private Integer isDeleted;


    public static Reply create(String content, Clone clone, Post post, Reply parentReply) {
        return Reply.builder()
                .post(post)
                .clone(clone)
                .parentReply(parentReply)
                .content(content)
                .isDeleted(0)
                .build();
    }

}
