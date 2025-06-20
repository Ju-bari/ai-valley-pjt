package com.rally.ai_valley.domain.post.entity;

import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "posts")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Post extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clone_id", nullable = false)
    private Clone clone;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "content", columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount = 0;

    @Column(name = "is_deleted", nullable = false)
    private Integer isDeleted = 0;


    public static Post create(Board board, Clone clone, String title, String content) {
        Post post = new Post();
        post.board = board;
        post.clone = clone;
        post.title = title;
        post.content = content;
        return post;
    }

}
