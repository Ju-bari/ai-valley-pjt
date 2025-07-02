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
import java.util.Optional;

// isActive
@Repository
public interface CloneRepository extends JpaRepository<Clone, Long> {

    @Query("""
            SELECT c
            FROM Clone c
            WHERE c.id = :cloneId
        """)
    Optional<Clone> findCloneById(@Param("cloneId") Long cloneId);

    @Query("""
            SELECT new com.rally.ai_valley.domain.clone.dto.CloneInfoResponse(c.id, u.id, u.nickname, c.name, c.description, c.isActive)
            FROM Clone c
            LEFT JOIN c.user u
            WHERE u.id = :userId
        """)
    List<CloneInfoResponse> findAllClonesByUserId(@Param("userId") Long userId);

    @Query("""
            SELECT new com.rally.ai_valley.domain.clone.dto.CloneInfoResponse(c.id, u.id, u.nickname, c.name, c.description, c.isActive)
            FROM Clone c
            LEFT JOIN c.user u
            WHERE c.id = :cloneId
        """)
    CloneInfoResponse findCloneByCloneId(@Param("cloneId") Long cloneId);

    @Query("""
            SELECT new com.rally.ai_valley.domain.clone.dto.CloneStatisticsResponse(
                COUNT(DISTINCT cb.cloneBoardId),
                COUNT(DISTINCT p.id),
                COUNT(DISTINCT r.id)
            )
            FROM Clone c
            LEFT JOIN c.cloneBoards cb ON cb.isActive = 1
            LEFT JOIN c.posts p ON p.isDeleted = 0
            LEFT JOIN c.replies r ON r.isDeleted = 0
            WHERE c.id = :cloneId
        """)
    CloneStatisticsResponse findUserStatisticsByCloneId(@Param("cloneId") Long cloneId);

    @Query("""
            SELECT new com.rally.ai_valley.domain.clone.dto.CloneInBoardInfoResponse(c.id, b.id, c.name, c.description, cb.isActive)
            FROM CloneBoard cb
            LEFT JOIN cb.clone c
            LEFT JOIN cb.board b
            WHERE b.id = :boardId
                AND b.isDeleted = 0
                AND cb.isActive = 1
            """)
    List<CloneInBoardInfoResponse> findAllClonesInBoard(@Param("boardId") Long boardId);

    @Query("""
            SELECT new com.rally.ai_valley.domain.clone.dto.CloneInBoardInfoResponse(c.id, b.id, c.name, c.description, cb.isActive)
            FROM CloneBoard cb
            LEFT JOIN cb.clone c
            LEFT JOIN cb.board b
            LEFT JOIN c.user u
            WHERE b.id = :boardId
                AND u.id = :userId
                AND b.isDeleted = 0
                AND cb.isActive = 1
            """)
    List<CloneInBoardInfoResponse> findMyClonesInBoard(@Param("boardId") Long boardId, @Param("userId") Long userId);

}