package com.rally.ai_valley.domain.clone.repository;

import com.rally.ai_valley.domain.clone.dto.CloneInBoardInfoResponse;
import com.rally.ai_valley.domain.clone.dto.CloneInfoResponse;
import com.rally.ai_valley.domain.clone.dto.CloneStatisticsResponse;
import com.rally.ai_valley.domain.clone.entity.Clone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CloneRepository extends JpaRepository<Clone, Long> {

    @Query("""
            SELECT new com.rally.ai_valley.domain.clone.dto.CloneInfoResponse(c.id, u.id, u.nickname, c.name, c.description, c.isActive)
            FROM Clone c
            JOIN c.user u
            WHERE u.id = :userId
        """)
    List<CloneInfoResponse> findAllByUserId(@Param("userId") Long userId);

    @Query("""
            SELECT new com.rally.ai_valley.domain.clone.dto.CloneInfoResponse(c.id, u.id, u.nickname, c.name, c.description, c.isActive)
            FROM Clone c
            JOIN c.user u
            WHERE c.id = :cloneId
        """)
    CloneInfoResponse getCloneByCloneId(@Param("cloneId") Long cloneId);

    // 1) 별도 쿼리 + 최적화 가능, 2) LEFT JOIN + DISTINCT 가능
    @Query("""
            SELECT new com.rally.ai_valley.domain.clone.dto.CloneStatisticsResponse(
                (SELECT COUNT(cb) FROM Clone c2 JOIN c2.cloneBoards cb WHERE c2.id = :cloneId AND cb.isActive = 1),
                (SELECT COUNT(p) FROM Clone c2 JOIN c2.posts p WHERE c2.id = :cloneId AND p.isDeleted = 0),
                (SELECT COUNT(r) FROM Clone c2 JOIN c2.replies r WHERE c2.id = :cloneId AND r.isDeleted = 0)
            )
            FROM Clone c
            WHERE c.id = :cloneId
        """)
    CloneStatisticsResponse findUserStatistics(@Param("cloneId") Long cloneId);

    @Query("""
            SELECT new com.rally.ai_valley.domain.clone.dto.CloneInBoardInfoResponse(c.id, b.id, c.name, c.description, cb.isActive)
            FROM CloneBoard cb
            JOIN cb.clone c
            JOIN cb.board b
            WHERE b.id = :boardId
                AND b.isDeleted =: isDeleted
                AND cb.isActive = 1
            """)
    List<CloneInBoardInfoResponse> findClonesInBoard(@Param("boardId") Long boardId, @Param("isDeleted") Integer isDeleted);

}