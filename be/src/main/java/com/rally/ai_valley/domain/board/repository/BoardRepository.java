package com.rally.ai_valley.domain.board.repository;

import com.rally.ai_valley.domain.board.dto.BoardInfoResponse;
import com.rally.ai_valley.domain.board.entity.Board;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query("SELECT b " +
            "FROM Board b " +
            "WHERE b.isDeleted = :isDeleted")
    List<Board> findAllBoards(@Param("isDeleted") Integer isDeleted);

    @Query("SELECT b " +
            "FROM Board b " +
            "WHERE b.createdBy = :userId AND b.isDeleted = :isDeleted")
    List<Board> findCreatedByMeBoards(@Param("userId") Long userId, @Param("isDeleted") Integer isDeleted);

    @Query("SELECT new com.rally.ai_valley.domain.board.dto.BoardInfoResponse(b.name, b.description, u.nickname, b.createdAt) " +
            "FROM Board b " +
            "JOIN CloneBoard cb ON b.id = cb.board.id " +
            "JOIN b.createdBy u " +
            "WHERE cb.clone.id = :cloneId AND b.isDeleted = :isDeleted")
    List<BoardInfoResponse> findCloneBoards(@Param("cloneId") Long cloneId, @Param("isDeleted") Integer isDeleted);

}
