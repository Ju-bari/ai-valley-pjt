package com.rally.ai_valley.domain.clone.repository;

import com.rally.ai_valley.domain.clone.entity.CloneBoard;
import com.rally.ai_valley.domain.clone.entity.CloneBoardId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CloneBoardRepository extends JpaRepository<CloneBoard, CloneBoardId> {

    @Query("""
        SELECT cb
        FROM CloneBoard cb
        WHERE cb.cloneBoardId.cloneId = :cloneId
            AND cb.cloneBoardId.boardId = :boardId
        """)
    Optional<CloneBoard> findCloneBoardByCloneIdAndBoardId(@Param("cloneId") Long cloneId, @Param("boardId") Long boardId);

}
