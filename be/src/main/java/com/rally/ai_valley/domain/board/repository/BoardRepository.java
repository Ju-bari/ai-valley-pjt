package com.rally.ai_valley.domain.board.repository;

import com.rally.ai_valley.domain.board.dto.BoardInfoResponse;
import com.rally.ai_valley.domain.board.dto.BoardsInCloneResponse;
import com.rally.ai_valley.domain.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("""
            SELECT new com.rally.ai_valley.domain.board.dto.BoardInfoResponse(b.id, b.name, u.nickname, b.description,
                        (SELECT COUNT(DISTINCT cb.clone.id) FROM CloneBoard cb WHERE cb.isActive = 1),
                        (SELECT COUNT(p) FROM Post p WHERE p.board.id = b.id AND p.isDeleted = 0),
                        (SELECT COUNT(r) FROM Reply r INNER JOIN r.post p WHERE p.board.id = b.id AND p.isDeleted = 0 AND r.isDeleted = 0),
                        b.createdAt)
            FROM Board b
            JOIN b.createdBy u
            WHERE b.isDeleted = :isDeleted
            """)
    List<BoardInfoResponse> findAllBoards(@Param("isDeleted") Integer isDeleted);

    // 나의 클론들이 속한 게시판들의 모음
    @Query("""
            SELECT new com.rally.ai_valley.domain.board.dto.BoardInfoResponse(b.id, b.name, u.nickname, b.description,
                        (SELECT COUNT(DISTINCT cb.clone.id) FROM CloneBoard cb WHERE cb.isActive = 1),
                        (SELECT COUNT(p) FROM Post p WHERE p.board.id = b.id AND p.isDeleted = 0),
                        (SELECT COUNT(r) FROM Reply r INNER JOIN r.post p WHERE p.board.id = b.id AND p.isDeleted = 0 AND r.isDeleted = 0),
                        b.createdAt)
            FROM Board b
            JOIN b.createdBy u
            JOIN b.cloneBoards cb
            WHERE cb.clone.user.id = :userId
                AND cb.isActive = 1
                AND b.isDeleted = :isDeleted
            """)
    List<BoardInfoResponse> findCreatedByMyBoards(@Param("userId") Long userId, @Param("isDeleted") Integer isDeleted);

    @Query("""
            SELECT new com.rally.ai_valley.domain.board.dto.BoardsInCloneResponse(cb.board.id, cb.clone.id, b.name, b.description, u.nickname, b.createdAt)
            FROM Board b
            JOIN CloneBoard cb ON b.id = cb.board.id
            JOIN b.createdBy u
            WHERE cb.clone.id = :cloneId
                AND b.isDeleted = :isDeleted
                AND cb.isActive = 1
            """)
    List<BoardsInCloneResponse> findBoardsInClone(@Param("cloneId") Long cloneId, @Param("isDeleted") Integer isDeleted);

}
