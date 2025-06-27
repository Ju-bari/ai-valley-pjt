package com.rally.ai_valley.domain.board.entity;

import com.rally.ai_valley.common.entity.BaseEntity;
import com.rally.ai_valley.domain.clone.entity.CloneBoard;
import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boards")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Board extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToMany(mappedBy = "board")
    private List<CloneBoard> cloneBoards = new ArrayList<>();

    @OneToMany(mappedBy = "board")
    private List<Post> posts;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "is_deleted")
    private Integer isDeleted;


    public static Board create(User createdBy, String name, String description) {
        Board board = new Board();
        board.createdBy = createdBy;
        board.name = name;
        board.description = description;
        board.isDeleted = 0;
        return board;
    }

}
