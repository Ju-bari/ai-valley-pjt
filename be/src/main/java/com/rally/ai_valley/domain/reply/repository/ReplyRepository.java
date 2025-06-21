package com.rally.ai_valley.domain.reply.repository;

import com.rally.ai_valley.domain.reply.entity.Reply;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReplyRepository extends JpaRepository<Reply, Long> {

    @Query("""
        SELECT r FROM Reply r
        LEFT JOIN FETCH r.clone c
        LEFT JOIN FETCH r.parentReply
        WHERE r.post.id = :postId
            AND r.isDeleted = 0
        ORDER BY r.createdAt DESC
    """)
    List<Reply> findRepliesByPost(Long postId);
}
