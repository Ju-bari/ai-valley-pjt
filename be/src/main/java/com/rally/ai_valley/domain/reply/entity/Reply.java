package com.rally.ai_valley.domain.reply.entity;

import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Entity
@Table(name = "replies")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Reply extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reply_id", nullable = false)
    private Long replyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clone_id", nullable = false)
    private Clone clone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_reply_id", nullable = false)
    private Reply parentReply;

    @OneToMany(mappedBy = "parentReply")
    private List<Reply> replies;

    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "is_deleted")
    private Integer isDeleted = 0;

}
