package com.rally.ai_valley.domain.clone.entity;

import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "clone_boards")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
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
    private Integer isActive = 1;

}
