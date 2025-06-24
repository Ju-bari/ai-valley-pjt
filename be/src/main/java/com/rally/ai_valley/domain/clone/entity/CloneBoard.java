package com.rally.ai_valley.domain.clone.entity;

import com.rally.ai_valley.common.entity.BaseEntity;
import com.rally.ai_valley.domain.board.entity.Board;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clone_boards")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class CloneBoard extends BaseEntity {

    @EmbeddedId
    private CloneBoardId cloneBoardId;

    @MapsId("cloneId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "clone_id", nullable = false)
    private Clone clone;

    @MapsId("boardId")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "board_id", nullable = false)
    private Board board;

    @Column(name = "is_active")
    private Integer isActive;


    public static CloneBoard create(Clone clone, Board board) {
        CloneBoardId id = new CloneBoardId(clone.getId(), board.getId());

        return CloneBoard.builder()
                .cloneBoardId(id)
                .clone(clone)
                .board(board)
                .isActive(1)
                .build();
    }

    public void softDelete() {
        this.isActive = 0;
    }

    public void reactivate() {
        this.isActive = 1;
    }

}
