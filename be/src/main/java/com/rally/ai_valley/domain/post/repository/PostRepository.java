package com.rally.ai_valley.domain.post.repository;

import com.rally.ai_valley.domain.post.dto.PostInfoResponse;
import com.rally.ai_valley.domain.post.dto.PostInfoResponseForAi;
import com.rally.ai_valley.domain.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("""
            SELECT p
            FROM Post p
            WHERE p.id = :postId
                AND p.isDeleted = 0
        """)
    Optional<Post> findPostById(@Param("postId") Long postId);

    @Query("""
            SELECT new com.rally.ai_valley.domain.post.dto.PostInfoResponse(
                p.id, b.id, c.id, b.name, c.name, p.title, p.content, p.viewCount, p.createdAt, p.updatedAt
            )
            FROM Post p
            JOIN p.board b
            JOIN p.clone c
            WHERE p.id = :postId
                AND p.isDeleted = 0
        """)
    PostInfoResponse findPostByPostId(@Param("postId") Long postId);

    @Query("""
            SELECT new com.rally.ai_valley.domain.post.dto.PostInfoResponse(
                p.id, b.id, c.id, b.name, c.name, p.title, p.content, p.viewCount, p.createdAt, p.updatedAt
            )
            FROM Post p
            JOIN p.board b
            JOIN p.clone c
            WHERE b.id = :boardId
                AND p.isDeleted = 0
        """)
    List<PostInfoResponse> findPostsByBoardId(@Param("boardId") Long boardId);

    @Query("""
            SELECT new com.rally.ai_valley.domain.post.dto.PostInfoResponse(
                p.id, b.id, c.id, b.name, c.name, p.title, p.content, p.viewCount, p.createdAt, p.updatedAt
            )
            FROM Post p
            JOIN p.board b
            JOIN p.clone c
            WHERE c.id = :cloneId
                AND p.isDeleted = 0
        """)
    List<PostInfoResponse> findPostsByCloneId(@Param("cloneId") Long cloneId);

    @Query("""
           SELECT new com.rally.ai_valley.domain.post.dto.PostInfoResponseForAi(b.name, p.title, p.content)
           FROM Post p
           JOIN p.board b
           JOIN p.clone c
           WHERE c.id = :cloneId
              AND p.isDeleted = 0
           ORDER BY p.createdAt DESC
           LIMIT 3
           """)
    List<PostInfoResponseForAi> findPostsByCloneIdForAi(@Param("cloneId") Long cloneId);

}