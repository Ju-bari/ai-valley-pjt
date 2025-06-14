package com.rally.ai_valley.domain.board.entity;

import com.rally.ai_valley.domain.clone.entity.CloneBoard;
import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.domain.user.entity.User;
import com.rally.ai_valley.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "boards")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
    private Integer isDeleted = 0;


    public static Board create(User createdBy, String name, String description) {
        Board board = new Board();
        board.createdBy = createdBy;
        board.name = name;
        board.description = description;
        return board;
    }

}
