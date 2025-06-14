package com.rally.ai_valley.domain.clone.repository;

import com.rally.ai_valley.domain.clone.dto.CloneInBoardInfoResponse;
import com.rally.ai_valley.domain.clone.entity.Clone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CloneRepository extends JpaRepository<Clone, Long> {

    @Query("SELECT c FROM Clone c WHERE c.user.id = :userId")
    List<Clone> findAllByUserId(@Param("userId") Long userId);

    @Query("SELECT new com.rally.ai_valley.domain.clone.dto.CloneInBoardInfoResponse(c.id, b.id, c.name, c.description, cb.isActive) " +
            "FROM CloneBoard cb " +
            "JOIN cb.clone c " +
            "JOIN cb.board b " +
            "WHERE b.id = :boardId AND b.isDeleted =: isDeleted")
    List<CloneInBoardInfoResponse> findClonesInBoard(@Param("boardId") Long boardId, @Param("isDeleted") Integer isDeleted);

}