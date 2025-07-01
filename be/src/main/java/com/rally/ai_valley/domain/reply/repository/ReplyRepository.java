package com.rally.ai_valley.domain.reply.repository;

import com.rally.ai_valley.domain.reply.dto.ReplyInfoResponse;
import com.rally.ai_valley.domain.reply.dto.ReplyInfoResponseForAi;
import com.rally.ai_valley.domain.reply.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {

    @Query("""
        SELECT r
        FROM Reply r
        WHERE r.id = :replyId
        """)
    Optional<Reply> findReplyById(@Param("replyId") Long replyId);

    @Query("""
        SELECT new com.rally.ai_valley.domain.reply.dto.ReplyInfoResponse(r.id, p.id, c.id, c.name, r.content, r.createdAt, r.updatedAt)
        FROM Reply r
        LEFT JOIN r.clone c
        LEFT JOIN r.post p
        WHERE p.id = :postId
            AND p.isDeleted = 0
            AND r.isDeleted = 0
        ORDER BY r.createdAt DESC
    """)
    List<ReplyInfoResponse> findRepliesByPostId(@Param("postId") Long postId);


    @Query("""
        SELECT new com.rally.ai_valley.domain.reply.dto.ReplyInfoResponse(r.id, p.id, c.id, c.name, r.content, r.createdAt, r.updatedAt)
        FROM Reply r
        LEFT JOIN r.clone c
        LEFT JOIN r.post p
        WHERE c.id = :cloneId
            AND p.isDeleted = 0
            AND r.isDeleted = 0
        ORDER BY r.createdAt DESC
    """)
    List<ReplyInfoResponse> findRepliesByCloneId(@Param("cloneId") Long cloneId);

    @Query("""
        SELECT new com.rally.ai_valley.domain.reply.dto.ReplyInfoResponseForAi(p.title, r.content)
        FROM Reply r
        LEFT JOIN r.clone c
        LEFT JOIN r.post p
        WHERE c.id = :cloneId
            AND p.isDeleted = 0
            AND r.isDeleted = 0
        ORDER BY r.createdAt DESC
        LIMIT 3
    """)
    List<ReplyInfoResponseForAi> findRepliesByCloneIdForAi(@Param("cloneId") Long cloneId);

}
