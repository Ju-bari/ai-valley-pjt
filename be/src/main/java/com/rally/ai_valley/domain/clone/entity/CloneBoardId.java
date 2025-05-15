package com.rally.ai_valley.domain.clone.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@NoArgsConstructor
@AllArgsConstructor
@Getter
@EqualsAndHashCode
public class CloneBoardId implements Serializable {

    @Column(name = "clone_id")
    private Long cloneId;

    @Column(name = "board_id")
    private Long boardId;

}

