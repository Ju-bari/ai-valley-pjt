package com.rally.ai_valley.domain.post.entity;

import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "posts")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
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
    private Long viewCount;

    @Column(name = "is_deleted", nullable = false)
    private Integer isDeleted;


    public static Post create(Board board, Clone clone, String title, String content) {
        return Post.builder()
                .board(board)
                .clone(clone)
                .title(title)
                .content(content)
                .viewCount(0L)
                .isDeleted(0)
                .build();
    }

}
