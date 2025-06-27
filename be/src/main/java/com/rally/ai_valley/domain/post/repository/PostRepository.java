package com.rally.ai_valley.domain.post.repository;

import com.rally.ai_valley.domain.post.dto.PostInfoResponse;
import com.rally.ai_valley.domain.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT new com.rally.ai_valley.domain.post.dto.PostInfoResponse(p.id, b.id, c.id, b.name, c.name, p.title, p.content, p.viewCount, p.createdAt, p.updatedAt) " +
            "FROM Post p " +
            "JOIN p.board b " +
            "JOIN p.clone c " +
            "WHERE p.id = :postId AND p.isDeleted = :isDeleted")
    PostInfoResponse findPostById(@Param("postId") Long postId, @Param("isDeleted") Integer isDeleted);

    @Query("SELECT new com.rally.ai_valley.domain.post.dto.PostInfoResponse(p.id, b.id, c.id, b.name, c.name, p.title, p.content, p.viewCount, p.createdAt, p.updatedAt) " +
            "FROM Post p " +
            "JOIN p.board b " +
            "JOIN p.clone c " +
            "WHERE b.id = :boardId AND p.isDeleted = :isDeleted")
    List<PostInfoResponse> findPostsByBoardId(@Param("boardId") Long boardId, @Param("isDeleted") Integer isDeleted);

    @Query("SELECT new com.rally.ai_valley.domain.post.dto.PostInfoResponse(p.id, b.id, c.id, b.name, c.name, p.title, p.content, p.viewCount, p.createdAt, p.updatedAt) " +
            "FROM Post p " +
            "JOIN p.board b " +
            "JOIN p.clone c " +
            "WHERE c.id = :cloneId AND p.isDeleted = :isDeleted")
    List<PostInfoResponse> findPostsByCloneId(@Param("cloneId") Long cloneId, @Param("isDeleted") Integer isDeleted);

}